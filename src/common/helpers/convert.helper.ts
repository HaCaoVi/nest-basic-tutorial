export const normalizeFilters = (query: Record<string, any>) => {
    const filter: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'string') {
            const regexMatch = value.match(/^\/(.*)\/([gimsuy]*)$/);
            if (regexMatch) {
                const pattern = regexMatch[1];
                const flags = regexMatch[2];

                // Nếu pattern rỗng (// hoặc //i ...) => bỏ qua filter này
                if (pattern.trim() === '') {
                    continue;
                }

                filter[key] = new RegExp(pattern, flags);
            } else {
                filter[key] = value;
            }
        } else {
            filter[key] = value;
        }
    }

    return filter;
};
