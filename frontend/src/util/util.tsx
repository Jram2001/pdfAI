import React from "react";
import { useActiveNumber } from "../service/activePage";

type PageTextProps = {
    text: string;
};

const PageText: React.FC<PageTextProps> = ({ text }) => {
    const { setNumber } = useActiveNumber();
    const pageRegex = /\(Page\s*(\d+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let i = 0;

    while ((match = pageRegex.exec(text)) !== null) {
        const [fullMatch, pageNum] = match;
        const before = text.slice(lastIndex, match.index);
        if (before) parts.push(before);
        parts.push(
            <span
                key={i}
                className="p-1 hover:bg-amber-200/20 cursor-pointer rounded-sm"
                onClick={() => setNumber(Number(pageNum))}
            >
                {fullMatch}
            </span>
        );
        lastIndex = match.index + fullMatch.length;
        i++;
    }
    parts.push(text.slice(lastIndex));
    return <>{parts}</>;;
};

export default PageText;
