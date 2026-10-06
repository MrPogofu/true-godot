shader_type canvas_item;
render_mode unshaded, blend_mix;

// Simple outline shader
uniform vec4 outline_color : source_color = vec4(1.0, 0.5, 0.0, 1.0);
uniform float width : hint_range(0.0, 10.0) = 2.0;
uniform sampler2D noise_tex : filter_linear, repeat_enable;

varying vec2 world_pos;

void vertex() {
	world_pos = (MODEL_MATRIX * vec4(VERTEX, 0.0, 1.0)).xy;
}

float sample_alpha(vec2 uv, vec2 offset) {
	return texture(TEXTURE, uv + offset * TEXTURE_PIXEL_SIZE).a;
}

void fragment() {
	vec4 col = texture(TEXTURE, UV);
	float a = 0.0;
	for (int i = 0; i < 4; i++) {
		a += sample_alpha(UV, vec2(cos(float(i)), sin(float(i))) * width);
	}
	if (col.a < 0.1 && a > 0.0) {
		COLOR = outline_color;
	} else {
		COLOR = col * texture(noise_tex, world_pos * 0.01);
	}
}
