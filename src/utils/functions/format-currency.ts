export function FormatCurrency(value:number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
}