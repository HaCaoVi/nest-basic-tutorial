export const normalizeFilters = (query: Record<string, any>) => {
    const filter: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'string') {
            // check xem có đúng format regex /.../flags không
            const regexMatch = value.match(/^\/(.+)\/([gimsuy]*)$/);
            if (regexMatch) {
                filter[key] = new RegExp(regexMatch[1], regexMatch[2]); // -> regex
            } else {
                filter[key] = value; // string thường
            }
        } else {
            filter[key] = value; // giữ nguyên (number, boolean...)
        }
    }

    return filter;
}
