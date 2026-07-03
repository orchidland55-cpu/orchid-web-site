import { ReactNode } from "react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  children?: ReactNode; // pour badges, tags additionnels, etc.
  onClick?: () => void;
}

const PropertyCard = ({ image, title, location, price, children, onClick }: PropertyCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{location}</p>
        <p className="font-medium text-primary">{price}</p>
        {children}
      </div>
    </div>
  );
};

export default PropertyCard;