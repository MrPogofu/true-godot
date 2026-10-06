@tool
class_name Player
extends CharacterBody2D
## Doc comment: the player controller.

signal health_changed(old_value: int, new_value: int)

enum State { IDLE, RUN, JUMP }

const MAX_SPEED := 300.0
@export var jump_velocity: float = -400.0
@onready var sprite: Sprite2D = $Sprite2D
@onready var label := %NameLabel as Label

var health: int = 100:
	set(value):
		health_changed.emit(health, value)
		health = clamp(value, 0, 100)

var _state := State.IDLE
var inventory: Dictionary[String, int] = {"coins": 3, "keys": 0x1F}
var tag := &"player"
var path := ^"../Enemy"


func _ready() -> void:
	# TODO: load settings from disk
	print("Ready: %s" % name)
	var nodes := get_tree().get_nodes_in_group("enemies")
	for node in nodes:
		if node is Enemy and not node.is_queued_for_deletion():
			node.connect("died", _on_enemy_died)


func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity += get_gravity() * delta
	elif Input.is_action_just_pressed(&"jump"):
		velocity.y = jump_velocity
	var direction := Input.get_axis("move_left", "move_right")
	match _state:
		State.IDLE when direction != 0:
			_state = State.RUN
		_:
			pass
	velocity.x = move_toward(velocity.x, direction * MAX_SPEED, 1e3 * delta)
	move_and_slide()


static func damage(amount: int = 10, is_crit := false) -> int:
	return amount * 2 if is_crit else amount


func _on_enemy_died(enemy: Node) -> void:
	await get_tree().create_timer(0.5).timeout
	self.health += 5  # FIXME: magic number
	sprite.modulate = Color(1.0, 0.5, 0.5, 1.0)
	return
