export enum UiColor {
    GRAY = 'gray',
    YELLOW = 'yellow',
    ORANGE = 'orange',
    RED = 'red',
    PINK = 'pink',
    PURPLE = 'purple',
    INDIGO = 'indigo',
    BLUE = 'blue',
    CYAN = 'cyan',
    GREEN = 'green',
    WHITE = 'white',
    BLACK = 'black',
}

export function UiColorFromString(color: string): UiColor {
    if (!(Object.values(UiColor) as string[]).includes(color)) {
        throw new Error(`Invalid color: ${color}`)
    }

    return UiColor[color.toUpperCase() as keyof typeof UiColor];
}
