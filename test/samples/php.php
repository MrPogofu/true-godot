<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Player model.
 */
final class Player extends Model implements \JsonSerializable
{
    public const MAX_HEALTH = 100;
    protected $fillable = ['name', 'health'];

    public function __construct(private string $name, private ?int $health = null)
    {
        $this->health ??= self::MAX_HEALTH;
    }

    public function jsonSerialize(): array
    {
        // TODO: hide internal fields
        return ['name' => $this->name, 'alive' => $this->health > 0];
    }

    public static function find(int $id): static|false
    {
        $rows = array_filter(self::all(), fn($p) => $p->id === $id);
        echo "Found {$id}: " . count($rows) . PHP_EOL;
        return $rows[0] ?? false;
    }
}
