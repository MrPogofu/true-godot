#include <stdio.h>
#include "vector.h"

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#ifndef NDEBUG
#  define LOG(msg) fprintf(stderr, "%s\n", msg)
#endif

typedef struct {
    float x, y;
} Vec2;

static const int SIZE = 16;
enum state { IDLE, RUN = 2 };

/* Adds two vectors */
Vec2 vec2_add(Vec2 a, const Vec2 *b) {
    return (Vec2){ a.x + b->x, a.y + b->y };
}

int main(int argc, char **argv) {
    unsigned long total = 0UL;
    for (int i = 0; i < argc; ++i) {
        if (argv[i] == NULL) continue;
        total += MAX(i, 3);
    }
    printf("Total: %lu, %c\n", total, 'x');
    return total > 0x10 ? 0 : -1;
}
