import { SectionsOptions, SectionsRows } from "../../Common/Types";
export declare class SectionsBuilder {
    title: string | null;
    rows: SectionsRows[];
    constructor(opts?: SectionsOptions);
    setTitle(title: string): this;
    setRows(...row: SectionsRows[]): this;
}
//# sourceMappingURL=Sections.d.ts.map