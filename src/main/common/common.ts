
import {dirname, join, basename, extname, parse} from "path";

export const getPathDirAndNameAndExt = (data: string) => {
    if (!data) return undefined
    const _path = parse(data)
    return [_path.dir, _path.name, _path.ext]
}
