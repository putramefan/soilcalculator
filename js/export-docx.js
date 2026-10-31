/**
 * Helper Ekspor Word dengan gaya akademik "Tabel Tiga Garis"
 */
(function() {
    var tableCounter = 0;

    /**
     * fmtID(): hanya format nilai bertipe number dengan toLocaleString('id-ID', {maximumFractionDigits: 4});
     * nilai string dikembalikan apa adanya (jangan parseFloat string).
     * Null/undefined/'' jadi '-'
     */
    function fmtID(val) {
        if (val === null || val === undefined || val === '') return '-';
        if (typeof val === 'number') {
            if (!isFinite(val)) return String(val);
            return val.toLocaleString('id-ID', { maximumFractionDigits: 4 });
        }
        return String(val);
    }

    function tabelTigaGaris(opts) {
        var nomor = opts.nomor;
        var judul = opts.judul;
        var header = opts.header;
        var baris = opts.baris;
        var D = window.docx;

        tableCounter++;
        var currentNomor = nomor || tableCounter;

        var thinBorder = { style: D.BorderStyle.SINGLE, size: 6, color: "000000" };
        var noBorder = { style: D.BorderStyle.NONE };
        var cellMargins = { top: 72, bottom: 72, left: 80, right: 80 };

        var caption = new D.Paragraph({
            children: [
                new D.TextRun({
                    text: 'Tabel ' + currentNomor + '. ' + judul,
                    font: "Times New Roman",
                    size: 24,
                    bold: false
                })
            ],
            spacing: { before: 240, after: 120 },
            alignment: D.AlignmentType.LEFT,
            keepNext: true
        });

        var tableRows = [];

        if (header && header.length > 0) {
            var headerCells = header.map(function(text) {
                return new D.TableCell({
                    children: [new D.Paragraph({
                        children: [new D.TextRun({ text: String(text), font: "Times New Roman", size: 24, bold: true })],
                        alignment: D.AlignmentType.CENTER
                    })],
                    verticalAlign: D.VerticalAlign.CENTER,
                    borders: {
                        top: thinBorder,
                        bottom: thinBorder,
                        left: noBorder,
                        right: noBorder
                    },
                    margins: cellMargins
                });
            });
            tableRows.push(new D.TableRow({
                children: headerCells,
                tableHeader: true
            }));
        }

        if (baris && baris.length > 0) {
            baris.forEach(function(rowData, idx) {
                var isLast = (idx === baris.length - 1);
                var dataCells = rowData.map(function(val) {
                    return new D.TableCell({
                        children: [new D.Paragraph({
                            children: [new D.TextRun({ text: fmtID(val), font: "Times New Roman", size: 24 })],
                            alignment: D.AlignmentType.CENTER
                        })],
                        verticalAlign: D.VerticalAlign.CENTER,
                        borders: {
                            top: noBorder,
                            bottom: isLast ? thinBorder : noBorder,
                            left: noBorder,
                            right: noBorder
                        },
                        margins: cellMargins
                    });
                });
                tableRows.push(new D.TableRow({
                    children: dataCells,
                    cantSplit: true
                }));
            });
        }

        var table = new D.Table({
            rows: tableRows,
            width: { size: 100, type: D.WidthType.PERCENTAGE },
            borders: {
                top: thinBorder,
                bottom: thinBorder,
                left: noBorder,
                right: noBorder,
                insideHorizontal: noBorder,
                insideVertical: noBorder
            }
        });

        var spacer = new D.Paragraph({ spacing: { after: 120 } });

        return [caption, table, spacer];
    }

    function exportToDocx(title, dataTables) {
        var D = window.docx;
        tableCounter = 0;

        var children = [
            new D.Paragraph({
                children: [new D.TextRun({ text: title, bold: true, size: 28, font: "Times New Roman" })],
                spacing: { after: 300 },
                alignment: D.AlignmentType.CENTER
            })
        ];

        dataTables.forEach(function(dt) {
            var components = tabelTigaGaris(dt);
            children.push.apply(children, components);
        });

        var waktu = new Date().toLocaleString('id-ID');
        children.push(new D.Paragraph({
            children: [new D.TextRun({
                text: 'Diekspor dari SOILS Calculator PRO pada ' + waktu,
                size: 18,
                font: "Times New Roman",
                color: "888888"
            })],
            spacing: { before: 400 },
            alignment: D.AlignmentType.CENTER
        }));

        var doc = new D.Document({
            sections: [{
                properties: {},
                children: children
            }]
        });

        return D.Packer.toBlob(doc).then(function(blob) {
            var safeName = title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
            window.saveAs(blob, safeName + '.docx');
        });
    }

    window.SoilsDocx = {
        exportToDocx: exportToDocx,
        fmtID: fmtID
    };
})();
