#include <godot_cpp/classes/node2d.hpp>
#include <vector>
#include <memory>

namespace godot {

template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

class Spinner : public Node2D {
    GDCLASS(Spinner, Node2D)

private:
    double speed = 1.5;
    std::vector<std::unique_ptr<Node>> children_;

protected:
    static void _bind_methods();

public:
    Spinner() = default;
    ~Spinner() override = default;

    void _process(double p_delta) override {
        set_rotation(get_rotation() + speed * p_delta);
    }

    template <Numeric T>
    [[nodiscard]] constexpr T clamp(T v, T lo, T hi) const noexcept {
        return v < lo ? lo : (v > hi ? hi : v);
    }
};

void Spinner::_bind_methods() {
    ClassDB::bind_method(D_METHOD("get_speed"), &Spinner::get_speed);
    auto lambda = [this](int x) -> bool { return x > 0 && this != nullptr; };
    UtilityFunctions::print("bound: ", true);
}

} // namespace godot
