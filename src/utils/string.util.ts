export const StringUtil = {
    // ---------------- BASIC ----------------

    trim(value: string): string {
        return value?.trim() ?? "";
    },

    toLower(value: string): string {
        return value?.toLowerCase() ?? "";
    },

    toUpper(value: string): string {
        return value?.toUpperCase() ?? "";
    },

    normalize(value: string): string {
        return value?.trim().toLowerCase() ?? "";
    },

    removeExtraSpaces(value: string): string {
        return value?.replace(/\s+/g, " ").trim() ?? "";
    },

    // ---------------- CHECKS ----------------

    isEmpty(value?: string | null): boolean {
        return !value || value.trim().length === 0;
    },

    isNotEmpty(value?: string | null): boolean {
        return !this.isEmpty(value);
    },

    // ---------------- FALLBACK ----------------

    fallback(value?: string | null, defaultValue = "-"): string {
        return this.isEmpty(value) ? defaultValue : value!.trim();
    },

    // ---------------- CASE FORMATTING ----------------

    capitalize(value: string): string {
        if (this.isEmpty(value)) return "";
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },

    toTitleCase(value: string): string {
        if (this.isEmpty(value)) return "";
        return value
            .toLowerCase()
            .split(" ")
            .map(word => this.capitalize(word))
            .join(" ");
    },

    camelToWords(value: string): string {
        if (this.isEmpty(value)) return "";
        return this.toTitleCase(
            value.replace(/([a-z])([A-Z])/g, "$1 $2")
        );
    },

    snakeToWords(value: string): string {
        if (this.isEmpty(value)) return "";
        return this.toTitleCase(value.replace(/_/g, " "));
    },

    kebabToWords(value: string): string {
        if (this.isEmpty(value)) return "";
        return this.toTitleCase(value.replace(/-/g, " "));
    },

    constantToWords(value: string): string {
        if (this.isEmpty(value)) return "";
        return this.toTitleCase(value.replace(/_/g, " ").toLowerCase());
    },

    // ---------------- TRANSFORM ----------------

    truncate(value: string, length: number): string {
        if (this.isEmpty(value)) return "";
        return value.length > length ? value.slice(0, length) + "..." : value;
    },

    initials(value: string): string {
        if (this.isEmpty(value)) return "";
        return value
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2);
    },

    slugify(value: string): string {
        if (this.isEmpty(value)) return "";
        return value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    },

    // ---------------- MATCHING ----------------

    includesIgnoreCase(source: string, search: string): boolean {
        return source.toLowerCase().includes(search.toLowerCase());
    },

    startsWithIgnoreCase(source: string, search: string): boolean {
        return source.toLowerCase().startsWith(search.toLowerCase());
    },
};