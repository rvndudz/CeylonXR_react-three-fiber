uniform float scaleFactor;
uniform float time;
uniform float mode;

varying float anim;
varying vec4 tint;
varying vec4 clip;

float PI = 3.14159;

void animate(inout vec3 center, inout vec3 covA, inout vec3 covB) {
    if (mode == 0.0) {
        // fade in effect

        anim = smoothstep(0.0, 1.0, time * 2.0 / (abs(center.y) + 1.0));

        float mt = fract(anim * 2.0 + fract(center.x * 10000.0) + fract(center.y * 10000.0) + fract(center.z * 10000.0)) * PI * 2.0;

        center += vec3(sin(mt) * sin(mt), cos(mt) * sin(mt), sin(mt)) * smoothstep(0.0, 1.0, 1.0 - anim) * 0.2;

        float scale = 0.0000005 + smoothstep(0.0, 0.5, anim) * 0.000005;

        covA = mix(normalize(covA) * scale, covA, smoothstep(0.0, 1.0, (anim - 0.5) * 2.0));
        covB = mix(normalize(covB) * scale, covB, smoothstep(0.0, 1.0, (anim - 0.5) * 2.0));

        anim = smoothstep(0.25, 0.75, anim);
        tint = vec4(1.0);
    } else {
        // fade out effect

        float fade = smoothstep(0.0, 1.0, abs(center.y) - (2.0 - time * 6.0));

        anim = 1.0;
        tint = vec4(vec3(1.0), 1.0 - fade);
    }
}

uniform vec3 view_position;

uniform sampler2D splatColor;

varying mediump vec2 texCoord;
varying mediump vec4 color;

mediump vec4 discardVec = vec4(0.0, 0.0, 2.0, 1.0);

void main(void)
{
    // calculate splat uv
    if (!calcSplatUV()) {
        gl_Position = discardVec;
        return;
    }

    // get center
    vec3 center = getCenter();

    // get covariance
    vec3 covA, covB;
    getCovariance(covA, covB);

    // animate
    animate(center, covA, covB);

    // handle transforms
    mat4 model_view = matrix_view * matrix_model;
    vec4 splat_cam = model_view * vec4(center, 1.0);
    vec4 splat_proj = matrix_projection * splat_cam;

    // cull behind camera
    if (splat_proj.z < -splat_proj.w) {
        gl_Position = discardVec;
        return;
    }

    vec4 v1v2 = calcV1V2(splat_cam.xyz, covA, covB, transpose(mat3(model_view)));

    // get color
    color = texelFetch(splatColor, splatUV, 0);

    // calculate scale based on alpha
    float scale = min(1.0, sqrt(-log(1.0 / 255.0 / color.a)) / 2.0);

    v1v2 *= scale;

    // early out tiny splats
    if (dot(v1v2.xy, v1v2.xy) < 4.0 && dot(v1v2.zw, v1v2.zw) < 4.0) {
        gl_Position = discardVec;
        return;
    }

    gl_Position = splat_proj + vec4((vertex_position.x * v1v2.xy + vertex_position.y * v1v2.zw) / viewport * splat_proj.w, 0, 0);

    texCoord = vertex_position.xy * scale / 2.0;

    #ifdef USE_SH1
        vec4 worldCenter = matrix_model * vec4(center, 1.0);
        vec3 viewDir = normalize((worldCenter.xyz / worldCenter.w - view_position) * mat3(matrix_model));
        color.xyz = max(color.xyz + evalSH(viewDir), 0.0);
    #endif

    #ifndef DITHER_NONE
        id = float(splatId);
    #endif
}
