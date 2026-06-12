import { Property } from "@/services/api";

export const propertyPath = (property: Property) =>
  `/property/${property.slug || property._id}`;

export const formatPrice = (
  price: number,
  currency: "MAD" | "USD" | "EUR" = "MAD"
) => {
  const localeMap = { MAD: "fr-MA", USD: "en-US", EUR: "fr-FR" };
  const symbolMap = { MAD: "MAD", USD: "$", EUR: "€" };
  const formatted = new Intl.NumberFormat(localeMap[currency], {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price);
  return currency === "MAD"
    ? `${formatted} MAD`
    : `${symbolMap[currency]}${formatted}`;
};