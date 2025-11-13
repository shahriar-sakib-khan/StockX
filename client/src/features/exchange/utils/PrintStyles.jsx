export default function PrintStyles() {
    return (
        <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 190mm; padding: 8mm; box-sizing: border-box; }
          .no-print { display: none !important; }
          input, textarea, select { border: none !important; box-shadow: none !important; }
        }

        .memo-paper {
          background: #fff;
          font-family: "Roboto Mono", "Courier New", monospace !important;
          color: #111827;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 640px) {
          .print-area { width: calc(100% - 32px); padding: 12px; }
        }
        `}</style>
    );
}
