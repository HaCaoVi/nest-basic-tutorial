type PopulateConfig = {
    path: string;
    select: string;
    options: { lean: true };
};

export const buildPopulateConfigFromStrings = (
    populateStr: string,
    fieldsStr: string
): PopulateConfig[] => {
    const paths = populateStr.split(",").map(p => p.trim()); // ["companyId","jobId"]
    const fieldsList = fieldsStr.split(",").map(f => f.trim());
    // ["companyId._id", "companyId.name", ...]

    // map path -> field[]
    const map: Record<string, string[]> = {};
    for (const path of paths) {
        map[path] = [];
    }

    for (const f of fieldsList) {
        const [path, field] = f.split(".");
        if (map[path]) {
            map[path].push(field);
        }
    }

    return Object.entries(map).map(([path, fields]) => ({
        path: path.replace(/Id$/, ""), // companyId -> company
        select: fields.join(" "),
        options: { lean: true },
    }));
}
