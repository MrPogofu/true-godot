#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inUV;
layout(set = 0, binding = 0) uniform UBO {
    mat4 mvp;
    float time;
} ubo;
layout(location = 0) out vec2 fragUV;

const float PI = 3.14159265;

// Wobble vertices over time
void main() {
    vec3 pos = inPosition;
    pos.y += sin(ubo.time * 2.0 + pos.x * PI) * 0.1;
    gl_Position = ubo.mvp * vec4(pos, 1.0);
    fragUV = inUV;
}
