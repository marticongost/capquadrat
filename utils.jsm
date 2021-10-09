export function vertical(property, amount) {
    return {[property + "Top"]: amount, [property + "Bottom"]: amount};
}

export function horizontal(property, amount) {
    return {[property + "Left"]: amount, [property + "Right"]: amount};
}

export const centerContent = horizontal(
    "padding",
    "calc(50% - var(--cq-content-width) / 2)"
);
