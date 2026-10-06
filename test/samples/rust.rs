use godot::prelude::*;
use std::collections::HashMap;

/// A spinning node.
#[derive(GodotClass, Debug)]
#[class(base = Sprite2D)]
pub struct Spinner {
    speed: f64,
    names: HashMap<String, u32>,
    base: Base<Sprite2D>,
}

#[godot_api]
impl ISprite2D for Spinner {
    fn init(base: Base<Sprite2D>) -> Self {
        godot_print!("Hello from Rust!");
        Self { speed: 400.0, names: HashMap::new(), base }
    }

    fn physics_process(&mut self, delta: f64) {
        let radians = (self.speed * delta) as f32;
        self.base_mut().rotate(radians);
    }
}

pub trait Shape<'a>: Clone + 'a {
    const SIDES: usize;
    fn area(&self) -> Option<f32>;
}

fn parse(input: &str) -> Result<Vec<i32>, std::num::ParseIntError> {
    // FIXME: handle whitespace
    input.split(',').map(|s| s.trim().parse::<i32>()).collect()
}

fn main() {
    let mut v = vec![1, 2, 3];
    if let Some(x) = v.iter().max() {
        println!("max = {x}, {:?}", v);
    }
    match v.len() {
        0 => unreachable!(),
        n @ 1..=3 => v.push(n as i32),
        _ => {}
    }
    let s = r#"raw "string""#; let c = 'c'; let b = b'\n'; let t = true;
}
