export type DateInput = string | number | Date;

function toDate(input: DateInput): Date {
    return input instanceof Date ? input : new Date(input);
}

function pad(value: number): string {
    return String(value).padStart(2, "0");
}

export const DateUtil = {
    // ---------------- BASIC ----------------

    now(): number {
        return Date.now();
    },

    today(): string {
        return new Date().toISOString().split("T")[0];
    },

    currentYear(): number {
        return new Date().getFullYear();
    },

    isCurrentYear(year: number | string): boolean {
        return Number(year) === this.currentYear();
    },

    // ---------------- MONTH ----------------

    getMonthName(monthIndex: number): string {
        const months = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];
        return months[monthIndex] ?? "invalid";
    },

    isCurrentMonth(month: string): boolean {
        const current = this.getMonthName(new Date().getMonth());
        return current === month.toLowerCase();
    },

    // ---------------- FORMAT ----------------

    formatDate(input: DateInput): string {
        const date = toDate(input);
        return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    },

    formatDateTime(input: DateInput): string {
        const date = toDate(input);

        const hours = date.getHours();
        const minutes = pad(date.getMinutes());
        const ampm = hours >= 12 ? "PM" : "AM";
        const h12 = hours % 12 || 12;

        return `${this.formatDate(date)} | ${pad(h12)}:${minutes} ${ampm}`;
    },

    formatDateWithDay(input: DateInput): string {
        const date = toDate(input);

        const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

        return `${formatted}, ${weekday}`;
    },

    formatTime(time: string): string {
        const [h, m] = time.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;

        return `${pad(h12)}:${pad(m)} ${ampm}`;
    },

    formatDuration(duration: string): string {
        const [h, m, s] = duration.split(":").map(Number);

        const parts: string[] = [];

        if (h) parts.push(`${h} hr`);
        if (m) parts.push(`${m} min`);
        if (!h && !m && s) parts.push(`${s} sec`);

        return parts.join(" ");
    },

    // ---------------- STRUCTURED ----------------

    splitDate(input: DateInput) {
        const date = toDate(input);

        return {
            day: pad(date.getDate()),
            month: date.toLocaleString("en-US", { month: "short" }),
            year: String(date.getFullYear()),
        };
    },

    // ---------------- DATE OPS ----------------

    addDays(input: DateInput, days: number): string {
        const date = toDate(input);
        date.setDate(date.getDate() + days);
        return this.formatDate(date);
    },

    isPastDate(input: DateInput): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const compare = toDate(input);
        compare.setHours(0, 0, 0, 0);

        return compare < today;
    },

    isSameDay(a: DateInput, b: DateInput): boolean {
        const d1 = toDate(a);
        const d2 = toDate(b);

        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    },
};