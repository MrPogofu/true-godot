// Simple pixel shader
cbuffer Constants : register(b0)
{
    float4x4 WorldViewProj;
    float Time;
};

Texture2D MainTex : register(t0);
SamplerState LinearSampler : register(s0);

struct PSInput
{
    float4 position : SV_POSITION;
    float2 uv : TEXCOORD0;
};

float4 PSMain(PSInput input) : SV_TARGET
{
    float4 col = MainTex.Sample(LinearSampler, input.uv);
    [unroll] for (int i = 0; i < 4; i++) { col.rgb *= 0.95f; }
    return lerp(col, float4(1, 0, 0, 1), saturate(sin(Time)));
}
