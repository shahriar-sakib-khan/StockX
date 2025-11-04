import React from "react";

export const Table = ({ headers, rows }) => (
    <table className="w-full border-collapse">
        <thead>
            <tr className="border-b">
                {headers.map((h) => (
                    <th
                        key={h}
                        className="px-3 py-2 text-left text-sm font-semibold"
                    >
                        {h}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((r, i) => (
                <tr
                    key={i}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    {r.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-sm">
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);
