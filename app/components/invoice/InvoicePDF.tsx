import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { getCalculations, CURRENCY_SYMBOLS } from '@/lib/calculations';

// ─── Paleta de colores ────────────────────────────────────────────────────────
const C = {
    dark: '#111827',
    gray500: '#6B7280',
    gray400: '#9CA3AF',
    gray300: '#D1D5DB',
    gray100: '#F3F4F6',
    gray50: '#F9FAFB',
    white: '#FFFFFF',
} as const;

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    // Página
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: C.white,
        paddingHorizontal: 40,
        paddingTop: 40,
        paddingBottom: 32,
        fontSize: 10,
        color: C.dark,
        flexDirection: 'column',
    },

    // ── Header ──────────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    logoBox: {
        width: 48,
        height: 48,
        backgroundColor: C.gray50,
        borderWidth: 1,
        borderColor: C.gray100,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        overflow: 'hidden',
    },
    logoImage: {
        width: 48,
        height: 48,
        objectFit: 'cover',
    },
    logoPlaceholder: {
        fontSize: 7,
        color: C.gray300,
    },
    emitterName: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 18,
        color: C.dark,
        marginBottom: 3,
    },
    emitterDetail: {
        fontSize: 8,
        color: C.gray400,
        marginBottom: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
        flexDirection: 'column',
    },
    invoiceTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 26,
        color: C.dark,
        marginBottom: 8,
    },
    invoiceNumber: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        marginBottom: 3,
    },
    invoiceMeta: {
        fontSize: 8,
        color: C.gray500,
        marginBottom: 2,
    },

    // ── Emisor / Receptor ────────────────────────────────────────────────────────
    partyRow: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    partyBlock: {
        flex: 1,
        flexDirection: 'column',
    },
    partyLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: C.gray400,
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    partyName: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        color: C.dark,
        marginBottom: 3,
    },
    partyDetail: {
        fontSize: 9,
        color: C.gray500,
        marginBottom: 2,
        lineHeight: 1.4,
    },

    // ── Tabla de items ───────────────────────────────────────────────────────────
    tableWrapper: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: C.gray100,
        paddingVertical: 8,
        alignItems: 'center',
    },
    tableHeaderCell: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: C.gray400,
        letterSpacing: 1,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: C.gray50,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: C.gray50,
    },
    colDescription: { flex: 2, paddingRight: 8 },
    colQty: { width: 44, textAlign: 'center' },
    colPrice: { width: 60, textAlign: 'right' },
    colTotal: { width: 60, textAlign: 'right' },
    cellText: { fontSize: 9, color: C.dark },
    cellTextBold: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.dark },

    // ── Totales ──────────────────────────────────────────────────────────────────
    totalsContainer: {
        marginTop: 20,
        paddingTop: 14,
        borderTopWidth: 2,
        borderTopColor: C.gray100,
        alignItems: 'flex-end',
    },
    totalsBlock: {
        width: '46%',
        flexDirection: 'column',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 6,
    },
    totalLabel: { fontSize: 9, color: C.gray500 },
    totalValue: { fontSize: 9, color: C.gray500 },
    totalFinalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: C.dark,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 4,
        marginTop: 6,
    },
    totalFinalLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: C.white,
        letterSpacing: 2,
    },
    totalFinalValue: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 14,
        color: C.white,
    },

    // ── Notas ────────────────────────────────────────────────────────────────────
    notesSection: {
        marginTop: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: C.gray100,
    },
    notesLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: C.gray400,
        letterSpacing: 1.5,
        marginBottom: 5,
    },
    notesText: {
        fontSize: 9,
        color: C.gray500,
        lineHeight: 1.5,
    },

    // ── Footer ───────────────────────────────────────────────────────────────────
    footer: {
        marginTop: 'auto',
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: C.gray100,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'Helvetica-Oblique',
        fontSize: 8,
        color: C.gray300,
    },
});

// ─── Componente ───────────────────────────────────────────────────────────────
interface InvoicePDFProps {
    data: InvoiceData;
}

export function InvoicePDF({ data }: InvoicePDFProps) {
    const { subtotal, taxAmount, total } = getCalculations(data.items, data.taxRate);
    const sym = CURRENCY_SYMBOLS[data.currency] ?? '$';
    const issueDate = new Date(data.issueDate).toLocaleDateString('es-ES');
    const dueDate = new Date(data.dueDate).toLocaleDateString('es-ES');
    const invoiceNo = data.invoiceNumber.padStart(3, '0');

    return (
        <Document>
            <Page size="A4" style={s.page}>

                {/* ── Header ─────────────────────────────────────────────────────────── */}
                <View style={s.header}>
                    {/* Izquierda: logo + datos emisor */}
                    <View style={s.headerLeft}>
                        <View style={s.logoBox}>
                            {data.emitterLogo ? (
                                <Image src={data.emitterLogo} style={s.logoImage} />
                            ) : (
                                <Text style={s.logoPlaceholder}>LOGO</Text>
                            )}
                        </View>
                        <Text style={s.emitterName}>{data.emitterName || 'Nombre Empresa'}</Text>
                        <Text style={s.emitterDetail}>{data.emitterEmail || 'empresa@email.com'}</Text>
                        <Text style={s.emitterDetail}>{data.emitterAddress || 'Calle Principal #123, Ciudad'}</Text>
                    </View>

                    {/* Derecha: título + número + fechas */}
                    <View style={s.headerRight}>
                        <Text style={s.invoiceTitle}>FACTURA</Text>
                        <Text style={s.invoiceNumber}>#{invoiceNo}</Text>
                        <Text style={s.invoiceMeta}>Fecha: {issueDate}</Text>
                        <Text style={s.invoiceMeta}>Vencimiento: {dueDate}</Text>
                    </View>
                </View>

                {/* ── Emisor / Receptor ───────────────────────────────────────────────── */}
                <View style={s.partyRow}>
                    <View style={s.partyBlock}>
                        <Text style={s.partyLabel}>DE</Text>
                        <Text style={s.partyName}>{data.emitterName || 'Nombre Empresa'}</Text>
                        <Text style={s.partyDetail}>{data.emitterAddress || 'Workspace Premium, 45B'}</Text>
                        <Text style={s.partyDetail}>
                            {data.emitterTaxId ? `NIT: ${data.emitterTaxId}` : 'NIT: 900.123.456-1'}
                        </Text>
                    </View>

                    <View style={s.partyBlock}>
                        <Text style={s.partyLabel}>COBRAR A</Text>
                        <Text style={s.partyName}>{data.receiverName || 'Cliente'}</Text>
                        <Text style={s.partyDetail}>{data.receiverEmail || 'cliente@ejemplo.com'}</Text>
                        <Text style={s.partyDetail}>{data.receiverAddress || 'Avenida Libertador #99'}</Text>
                    </View>
                </View>

                {/* ── Tabla de items ──────────────────────────────────────────────────── */}
                <View style={s.tableWrapper}>
                    {/* Encabezado */}
                    <View style={s.tableHeaderRow}>
                        <View style={s.colDescription}>
                            <Text style={s.tableHeaderCell}>DESCRIPCIÓN</Text>
                        </View>
                        <View style={s.colQty}>
                            <Text style={[s.tableHeaderCell, { textAlign: 'center' }]}>CANT.</Text>
                        </View>
                        <View style={s.colPrice}>
                            <Text style={[s.tableHeaderCell, { textAlign: 'right' }]}>PRECIO</Text>
                        </View>
                        <View style={s.colTotal}>
                            <Text style={[s.tableHeaderCell, { textAlign: 'right' }]}>TOTAL</Text>
                        </View>
                    </View>

                    {/* Filas */}
                    {data.items.map((item, i) => (
                        <View
                            key={item.id}
                            style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}
                        >
                            <View style={s.colDescription}>
                                <Text style={s.cellTextBold}>{item.description || 'Servicio profesional'}</Text>
                            </View>
                            <View style={s.colQty}>
                                <Text style={[s.cellText, { textAlign: 'center' }]}>{item.quantity}</Text>
                            </View>
                            <View style={s.colPrice}>
                                <Text style={[s.cellText, { textAlign: 'right' }]}>
                                    {sym}{item.price.toFixed(2)}
                                </Text>
                            </View>
                            <View style={s.colTotal}>
                                <Text style={[s.cellTextBold, { textAlign: 'right' }]}>
                                    {sym}{(item.quantity * item.price).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* ── Totales ─────────────────────────────────────────────────────────── */}
                <View style={s.totalsContainer}>
                    <View style={s.totalsBlock}>
                        <View style={s.totalRow}>
                            <Text style={s.totalLabel}>Subtotal</Text>
                            <Text style={s.totalValue}>{sym}{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={s.totalRow}>
                            <Text style={s.totalLabel}>
                                Impuestos ({(data.taxRate * 100).toFixed(0)}%)
                            </Text>
                            <Text style={s.totalValue}>{sym}{taxAmount.toFixed(2)}</Text>
                        </View>
                        <View style={s.totalFinalBox}>
                            <Text style={s.totalFinalLabel}>TOTAL</Text>
                            <Text style={s.totalFinalValue}>{sym}{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Notas ───────────────────────────────────────────────────────────── */}
                {data.notes && (
                    <View style={s.notesSection}>
                        <Text style={s.notesLabel}>NOTAS</Text>
                        <Text style={s.notesText}>{data.notes}</Text>
                    </View>
                )}

                {/* ── Footer ──────────────────────────────────────────────────────────── */}
                <View style={s.footer}>
                    <Text style={s.footerText}>Gracias por confiar en nosotros</Text>
                </View>

            </Page>
        </Document>
    );
}