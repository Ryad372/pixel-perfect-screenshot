import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flower2,
  Gift,
  Instagram,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  customerReviews,
  flowerProducts,
  formatPrice,
  productCategories,
  type FlowerProduct,
  type ProductCategory,
} from "@/lib/flower-shop-data";

interface CartLine {
  productId: string;
  quantity: number;
  size: string;
}

interface ShopContextValue {
  lines: CartLine[];
  count: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  addProduct: (productId: string, size?: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeProduct: (productId: string, size: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);
const CART_KEY = "flowers-rafiq-cart";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  const value = useMemo<ShopContextValue>(
    () => ({
      lines,
      count: lines.reduce((total, line) => total + line.quantity, 0),
      searchTerm,
      setSearchTerm,
      addProduct: (productId, size = "Moyen") => {
        setLines((current) => {
          const existing = current.find((line) => line.productId === productId && line.size === size);
          if (existing) {
            return current.map((line) =>
              line.productId === productId && line.size === size
                ? { ...line, quantity: line.quantity + 1 }
                : line,
            );
          }
          return [...current, { productId, size, quantity: 1 }];
        });
      },
      setQuantity: (productId, size, quantity) => {
        setLines((current) =>
          current
            .map((line) =>
              line.productId === productId && line.size === size ? { ...line, quantity } : line,
            )
            .filter((line) => line.quantity > 0),
        );
      },
      removeProduct: (productId, size) => {
        setLines((current) =>
          current.filter((line) => line.productId !== productId || line.size !== size),
        );
      },
    }),
    [hydrated, lines, searchTerm],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("ShopProvider is missing from the app shell.");
  return context;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand-mark" aria-label="Flowers Rafiq, accueil">
      <span className="brand-monogram">FR</span>
      {!compact && (
        <span className="brand-name">
          <span>Flowers Rafiq</span>
          <small>Fleuriste de quartier</small>
        </span>
      )}
    </Link>
  );
}

const navigation = [
  { label: "Accueil", to: "/" as const },
  { label: "Boutique", to: "/boutique" as const },
  { label: "Bouquet sur mesure", to: "/bouquet-sur-mesure" as const },
  { label: "À propos", to: "/a-propos" as const },
  { label: "Contact", to: "/contact" as const },
];

function SiteHeader() {
  const { count, setSearchTerm } = useShop();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(query.trim());
    setSearchOpen(false);
    setMenuOpen(false);
    void navigate({ to: "/boutique" });
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="mobile-actions">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="icon-button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <BrandMark />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          {searchOpen ? (
            <form className="header-search" onSubmit={submitSearch}>
              <Input
                autoFocus
                aria-label="Rechercher un produit"
                placeholder="Rechercher"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Button size="icon" variant="ghost" aria-label="Lancer la recherche">
                <Search />
              </Button>
            </form>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="icon-button search-trigger"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
          )}
          <Button asChild className="cart-button">
            <Link to="/panier" aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
              <ShoppingBag aria-hidden="true" />
              <span>Panier ({count})</span>
            </Link>
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ChevronRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div className="footer-brand-block">
          <BrandMark />
          <p>Fleurs fraîches livrées chez vous.</p>
        </div>
        <div className="footer-column">
          <h2>La boutique</h2>
          <Link to="/boutique">Boutique</Link>
          <Link to="/a-propos">À propos</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-column">
          <h2>Nous trouver</h2>
          <p>Au Maroc · ville à préciser</p>
          <p>Horaires communiqués sur demande</p>
          <span className="footer-social"><Instagram aria-hidden="true" /> Flowers Rafiq</span>
        </div>
        <div className="footer-note">
          <Flower2 aria-hidden="true" />
          <p>Chaque bouquet est composé à la main, avec des fleurs choisies pour vous.</p>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>© {new Date().getFullYear()} Flowers Rafiq</span>
        <span>Fait avec soin, au Maroc</span>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow?: string;
  title: string;
  link?: { label: string; to: "/boutique" | "/bouquet-sur-mesure" };
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Button variant="link" asChild className="text-link">
          <Link to={link.to}>{link.label} <ArrowRight aria-hidden="true" /></Link>
        </Button>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: FlowerProduct }) {
  const { addProduct } = useShop();
  return (
    <article className="product-card">
      <div className="product-image-wrap group">
        <Link
          to="/produit/$slug"
          params={{ slug: product.id }}
          className="product-image-link"
          aria-label={`Découvrir ${product.name}`}
        >
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        </Link>
        {product.topSeller && <span className="product-tag">Top vente</span>}
        <Button
          size="icon"
          className="product-add"
          aria-label={`Ajouter ${product.name} au panier`}
          title={`Ajouter ${product.name} au panier`}
          onClick={() => addProduct(product.id)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <div className="product-card-copy">
        <p className="product-category">{product.category}</p>
        <Link to="/produit/$slug" params={{ slug: product.id }} className="product-name">
          {product.name}
        </Link>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

function ProductGrid({ products }: { products: FlowerProduct[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export function HomePage() {
  const bestSellers = flowerProducts.filter((product) => product.topSeller).slice(0, 4);
  const categoryImages: Record<ProductCategory, string> = {
    Bouquets: "/flowers/bouquet.jpg",
    Boîtes: "/flowers/flower-box.jpg",
    Plantes: "/flowers/plants.jpg",
    Cadeaux: "/flowers/gifts.jpg",
  };

  return (
    <SiteLayout>
      <main>
        <section className="home-hero">
          <div className="hero-inner page-width">
            <div className="hero-copy">
              <p className="eyebrow">Fleurs · chocolats · cadeaux</p>
              <h1>Des fleurs qui parlent pour vous</h1>
              <p className="hero-subtitle">Bouquets frais, composés à la main et livrés chez vous.</p>
              <div className="hero-actions">
                <Button asChild className="primary-action">
                  <Link to="/boutique">Voir la boutique <ArrowRight aria-hidden="true" /></Link>
                </Button>
                <Button asChild variant="outline" className="outline-action">
                  <Link to="/bouquet-sur-mesure">Bouquet sur mesure</Link>
                </Button>
              </div>
              <div className="hero-promise"><Flower2 aria-hidden="true" /> Le bonheur, livré en fleurs.</div>
            </div>
            <div className="hero-photo-wrap">
              <img src="/flowers/bouquet.jpg" alt="Bouquet de fleurs fraîches composé à la main" />
              <div className="hero-photo-note"><span>Des fleurs de saison</span><strong>Une attention qui reste</strong></div>
              <span className="hero-photo-seal"><span>Fait à<br />la main</span><Flower2 aria-hidden="true" /></span>
            </div>
          </div>
        </section>

        <section className="page-section page-width">
          <SectionHeading eyebrow="La sélection du moment" title="Nos produits" link={{ label: "Voir la boutique", to: "/boutique" }} />
          <ProductGrid products={flowerProducts} />
          <div className="section-bottom-link">
            <Button asChild variant="outline" className="outline-action">
              <Link to="/boutique">Voir tous les produits <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>

        <section className="page-section section-soft">
          <div className="page-width">
            <SectionHeading eyebrow="Les coups de cœur" title="Les plus vendus" link={{ label: "Toute la sélection", to: "/boutique" }} />
            <ProductGrid products={bestSellers} />
          </div>
        </section>

        <section className="page-section page-width">
          <SectionHeading eyebrow="À chacun ses fleurs" title="Nos catégories" />
          <div className="category-grid">
            {productCategories.map((category, index) => (
              <Link key={category} to="/boutique" className={`category-tile category-tile-${index + 1}`}>
                <img src={categoryImages[category]} alt="" loading="lazy" />
                <span className="category-icon" aria-hidden="true">
                  {category === "Plantes" ? <Leaf /> : category === "Cadeaux" ? <Gift /> : <Flower2 />}
                </span>
                <span className="category-title">{category}</span>
                <span className="category-discover">Découvrir <ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-section section-soft">
          <div className="page-width">
            <SectionHeading eyebrow="Quelques mots doux" title="Avis de nos clients" />
            <div className="review-grid">
              {customerReviews.map((review) => (
                <article className="review-item" key={review.name}>
                  <div className="review-stars" aria-label="5 étoiles">
                    {Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" aria-hidden="true" />)}
                  </div>
                  <p>« {review.quote} »</p>
                  <strong>{review.name}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="custom-banner page-width">
          <div className="custom-banner-mark"><Flower2 aria-hidden="true" /><span>FR</span></div>
          <div className="custom-banner-copy">
            <p className="eyebrow">Une création rien qu’à vous</p>
            <h2>Un bouquet unique,<br />créé pour vous</h2>
            <p>Dites-nous l’occasion, vos couleurs et votre budget.</p>
          </div>
          <Button asChild variant="secondary" className="banner-button">
            <Link to="/bouquet-sur-mesure">Créer mon bouquet <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </section>
      </main>
    </SiteLayout>
  );
}

export function BoutiquePage() {
  const { searchTerm, setSearchTerm } = useShop();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("nouveautes");
  const [visibleCount, setVisibleCount] = useState(8);
  const filteredProducts = flowerProducts
    .filter((product) => activeCategory === "Tous" || product.category === activeCategory)
    .filter((product) => `${product.name} ${product.category}`.toLocaleLowerCase("fr").includes(searchTerm.toLocaleLowerCase("fr")))
    .sort((a, b) => {
      if (sortOrder === "prix-croissant") return a.price - b.price;
      if (sortOrder === "prix-decroissant") return b.price - a.price;
      return flowerProducts.indexOf(a) - flowerProducts.indexOf(b);
    });
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <SiteLayout>
      <main className="page-width page-section shop-page">
        <p className="eyebrow">La sélection Flowers Rafiq</p>
        <h1 className="page-title">Boutique</h1>
        <p className="page-intro">Des fleurs choisies avec soin, pour les jours précieux comme les jours ordinaires.</p>
        <div className="shop-controls">
          <div className="filter-chips" role="group" aria-label="Filtrer par catégorie">
            {["Tous", ...productCategories].map((category) => (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? "default" : "outline"}
                className="filter-chip"
                aria-pressed={activeCategory === category}
                onClick={() => { setActiveCategory(category); setVisibleCount(8); }}
              >
                {category}
              </Button>
            ))}
          </div>
          <label className="sort-control">
            <span>Trier par</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="nouveautes">Nouveautés</option>
              <option value="prix-croissant">Prix croissant</option>
              <option value="prix-decroissant">Prix décroissant</option>
            </select>
          </label>
        </div>
        {searchTerm && (
          <div className="search-result-note">
            <span>Résultats pour « {searchTerm} »</span>
            <Button type="button" variant="link" onClick={() => setSearchTerm("")}>Effacer</Button>
          </div>
        )}
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="empty-state"><Flower2 aria-hidden="true" /><h2>Aucun produit trouvé</h2><p>Essayez une autre recherche ou catégorie.</p></div>
        )}
        {visibleCount < filteredProducts.length && (
          <div className="section-bottom-link">
            <Button variant="outline" className="outline-action" onClick={() => setVisibleCount((count) => count + 4)}>
              Voir plus <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        )}
      </main>
    </SiteLayout>
  );
}

function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Fil d’Ariane" className="breadcrumbs">
      <Link to="/">Accueil</Link><ChevronRight aria-hidden="true" /><Link to="/boutique">Boutique</Link><ChevronRight aria-hidden="true" /><span>{current}</span>
    </nav>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  const product = flowerProducts.find((item) => item.id === slug);
  const { addProduct } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Moyen");
  const [quantity, setQuantity] = useState(1);
  const [whatsappNotice, setWhatsappNotice] = useState(false);

  if (!product) {
    return (
      <SiteLayout>
        <main className="page-width page-section empty-state"><Flower2 aria-hidden="true" /><h1>Produit introuvable</h1><Button asChild><Link to="/boutique">Retour à la boutique</Link></Button></main>
      </SiteLayout>
    );
  }

  const gallery = [product.image, "/flowers/bouquet.jpg", "/flowers/flower-box.jpg"];
  const similar = flowerProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);

  return (
    <SiteLayout>
      <main className="page-width page-section product-page">
        <Breadcrumbs current={product.name} />
        <div className="product-detail-layout">
          <div className="product-gallery">
            <div className="product-thumbnails" aria-label="Photos du produit">
              {gallery.map((image, index) => (
                <Button
                  type="button"
                  key={`${image}-${index}`}
                  variant="ghost"
                  className={`thumbnail-button ${selectedImage === index ? "is-selected" : ""}`}
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt="" />
                </Button>
              ))}
            </div>
            <img src={gallery[selectedImage] ?? product.image} alt={product.name} className="product-main-image" />
          </div>
          <div className="product-detail-copy">
            <p className="eyebrow">{product.category} · Fait à la main</p>
            <h1>{product.name}</h1>
            <div className="rating-line">
              <span className="review-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" aria-hidden="true" />)}</span>
              <span>4,9 · 18 avis</span>
            </div>
            <p className="detail-price">{formatPrice(product.price)}</p>
            <p className="detail-description">{product.description}</p>
            <div className="option-group">
              <span className="field-label">Taille <strong>{selectedSize}</strong></span>
              <div className="option-row" role="group" aria-label="Choisir une taille">
                {["Petit", "Moyen", "Grand"].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSize === size ? "default" : "outline"}
                    className="size-option"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >{size}</Button>
                ))}
              </div>
            </div>
            <label className="form-field">
              <span>Message sur la carte</span>
              <Textarea placeholder="Quelques mots doux…" rows={3} />
            </label>
            <div className="detail-buy-row">
              <div className="quantity-control" aria-label="Quantité">
                <Button type="button" size="icon" variant="ghost" aria-label="Diminuer la quantité" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus /></Button>
                <span aria-live="polite">{quantity}</span>
                <Button type="button" size="icon" variant="ghost" aria-label="Augmenter la quantité" onClick={() => setQuantity((value) => value + 1)}><Plus /></Button>
              </div>
              <Button className="primary-action add-detail-button" onClick={() => { for (let index = 0; index < quantity; index += 1) addProduct(product.id, selectedSize); }}>
                <ShoppingBag aria-hidden="true" /> Ajouter au panier
              </Button>
            </div>
            <Button type="button" variant="outline" className="outline-action whatsapp-action" onClick={() => setWhatsappNotice(true)}>
              Commander sur WhatsApp
            </Button>
            {whatsappNotice && <p className="form-notice">Le numéro WhatsApp de la boutique doit être renseigné pour activer cette option.</p>}
            <div className="delivery-promises"><span><Truck aria-hidden="true" /> Livraison à organiser</span><span><Flower2 aria-hidden="true" /> Fraîcheur garantie</span></div>
          </div>
        </div>
        {similar.length > 0 && (
          <section className="page-section related-section">
            <SectionHeading title="Produits similaires" link={{ label: "Voir la boutique", to: "/boutique" }} />
            <ProductGrid products={similar} />
          </section>
        )}
      </main>
      <div className="mobile-product-action"><Button className="primary-action" onClick={() => { for (let index = 0; index < quantity; index += 1) addProduct(product.id, selectedSize); }}><ShoppingBag aria-hidden="true" /> Ajouter au panier · {formatPrice(product.price * quantity)}</Button></div>
    </SiteLayout>
  );
}

function CartSummary({ subtotal }: { subtotal: number }) {
  const delivery = subtotal > 0 ? 25 : 0;
  return (
    <aside className="cart-summary">
      <h2>Votre commande</h2>
      <div className="summary-row"><span>Sous-total</span><strong>{formatPrice(subtotal)}</strong></div>
      <div className="summary-row"><span>Livraison estimée</span><strong>{formatPrice(delivery)}</strong></div>
      <div className="summary-total"><span>Total estimé</span><strong>{formatPrice(subtotal + delivery)}</strong></div>
      <p>Le montant final de la livraison sera confirmé par la boutique.</p>
    </aside>
  );
}

export function CartPage() {
  const { lines, setQuantity, removeProduct } = useShop();
  const [submitted, setSubmitted] = useState(false);
  const cartItems = lines.flatMap((line) => {
    const product = flowerProducts.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = cartItems.reduce((total, line) => total + line.product.price * line.quantity, 0);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <main className="page-width page-section cart-page">
        <Breadcrumbs current="Panier" />
        <p className="eyebrow">Tout est presque prêt</p>
        <h1 className="page-title">Votre panier</h1>
        {cartItems.length === 0 ? (
          <div className="empty-state cart-empty"><ShoppingBag aria-hidden="true" /><h2>Votre panier est encore vide</h2><p>Il y a sûrement des fleurs qui vous attendent.</p><Button asChild className="primary-action"><Link to="/boutique">Découvrir la boutique <ArrowRight aria-hidden="true" /></Link></Button></div>
        ) : (
          <div className="checkout-layout">
            <form className="delivery-form" onSubmit={submitOrder}>
              <section className="form-section">
                <h2>Vos articles</h2>
                <div className="cart-lines">
                  {cartItems.map((line) => (
                    <article className="cart-line" key={`${line.product.id}-${line.size}`}>
                      <Link to="/produit/$slug" params={{ slug: line.product.id }}><img src={line.product.image} alt={line.product.name} /></Link>
                      <div className="cart-line-copy"><Link to="/produit/$slug" params={{ slug: line.product.id }}>{line.product.name}</Link><span>{line.size} · {formatPrice(line.product.price)}</span><div className="quantity-control compact">
                        <Button type="button" size="icon" variant="ghost" aria-label={`Diminuer ${line.product.name}`} onClick={() => setQuantity(line.product.id, line.size, line.quantity - 1)}><Minus /></Button><span>{line.quantity}</span><Button type="button" size="icon" variant="ghost" aria-label={`Augmenter ${line.product.name}`} onClick={() => setQuantity(line.product.id, line.size, line.quantity + 1)}><Plus /></Button>
                      </div></div>
                      <div className="cart-line-end"><strong>{formatPrice(line.product.price * line.quantity)}</strong><Button type="button" variant="ghost" size="icon" aria-label={`Retirer ${line.product.name}`} onClick={() => removeProduct(line.product.id, line.size)}><Trash2 /></Button></div>
                    </article>
                  ))}
                </div>
              </section>
              <section className="form-section">
                <h2>Livraison</h2>
                <div className="form-grid">
                  <label className="form-field"><span>Nom complet</span><Input required placeholder="Votre nom" /></label>
                  <label className="form-field"><span>Téléphone</span><Input required type="tel" placeholder="Votre numéro" /></label>
                  <label className="form-field form-span-2"><span>Adresse</span><Input required placeholder="Adresse de livraison" /></label>
                  <label className="form-field"><span>Ville</span><Input required placeholder="Votre ville" /></label>
                  <label className="form-field"><span>Date de livraison</span><Input type="date" /></label>
                  <label className="form-field form-span-2"><span>Message sur la carte</span><Textarea rows={3} placeholder="Quelques mots à joindre à votre bouquet…" /></label>
                </div>
              </section>
              <fieldset className="form-section payment-section">
                <legend>Moyen de paiement souhaité</legend>
                <label className="radio-option"><input type="radio" name="payment" value="delivery" defaultChecked /><span>Paiement à la livraison</span></label>
                <label className="radio-option"><input type="radio" name="payment" value="card" /><span>Carte bancaire</span><small>À confirmer avec la boutique</small></label>
              </fieldset>
              <Button className="primary-action confirm-order" type="submit">Confirmer la commande <ArrowRight aria-hidden="true" /></Button>
              {submitted && <p className="form-notice" role="status">Votre demande est prête, mais la boutique n’est pas encore connectée pour recevoir les commandes.</p>}
            </form>
            <CartSummary subtotal={subtotal} />
          </div>
        )}
      </main>
    </SiteLayout>
  );
}

const customColors = [
  { name: "Bordeaux", colorClass: "swatch-burgundy" },
  { name: "Rose", colorClass: "swatch-blush" },
  { name: "Bleu", colorClass: "swatch-blue" },
  { name: "Blanc", colorClass: "swatch-white" },
  { name: "Teal", colorClass: "swatch-teal" },
];

export function CustomBouquetPage() {
  const [occasion, setOccasion] = useState("Anniversaire");
  const [budget, setBudget] = useState("Moyen");
  const [colors, setColors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <main className="page-width page-section custom-page">
        <Breadcrumbs current="Bouquet sur mesure" />
        <div className="custom-layout">
          <aside className="custom-aside">
            <span className="custom-aside-icon"><Flower2 aria-hidden="true" /></span>
            <p className="eyebrow">Une création à votre image</p>
            <h1>Créez votre bouquet</h1>
            <p>Racontez-nous l’occasion, les couleurs que vous aimez et votre budget. Nous imaginons une composition pensée pour vous.</p>
            <img src="/flowers/bouquet.jpg" alt="Fleurs fraîches pour une création sur mesure" />
            <p className="custom-aside-note"><SparkleMark /> Chaque bouquet est unique, préparé à la main.</p>
          </aside>
          <form className="custom-form" onSubmit={submitRequest}>
            <fieldset className="form-section compact-section">
              <legend><span className="step-number">1</span> Pour quelle occasion ?</legend>
              <div className="option-row wrap-options">
                {["Anniversaire", "Mariage", "Remerciement", "Autre"].map((item) => <Button key={item} type="button" variant={occasion === item ? "default" : "outline"} className="filter-chip" aria-pressed={occasion === item} onClick={() => setOccasion(item)}>{item}</Button>)}
              </div>
            </fieldset>
            <fieldset className="form-section compact-section">
              <legend><span className="step-number">2</span> Votre budget</legend>
              <div className="option-row wrap-options">
                {["Petit", "Moyen", "Élevé"].map((item) => <Button key={item} type="button" variant={budget === item ? "default" : "outline"} className="filter-chip" aria-pressed={budget === item} onClick={() => setBudget(item)}>{item}</Button>)}
              </div>
            </fieldset>
            <fieldset className="form-section compact-section">
              <legend><span className="step-number">3</span> Les couleurs que vous aimez</legend>
              <div className="swatch-row">
                {customColors.map((item) => {
                  const selected = colors.includes(item.name);
                  return <Button key={item.name} type="button" variant="ghost" className={`color-swatch ${item.colorClass} ${selected ? "is-selected" : ""}`} aria-label={item.name} aria-pressed={selected} onClick={() => setColors((current) => selected ? current.filter((color) => color !== item.name) : [...current, item.name])}>{selected && <Check aria-hidden="true" />}</Button>;
                })}
              </div>
            </fieldset>
            <label className="form-field"><span>Votre idée</span><Textarea rows={4} placeholder="Une ambiance, une fleur préférée, un petit détail…" /></label>
            <div className="form-grid">
              <label className="form-field"><span>Date de livraison</span><Input type="date" /></label>
              <label className="form-field"><span>Ville</span><Input required placeholder="Votre ville" /></label>
            </div>
            <label className="form-field upload-field"><span>Une photo d’inspiration (facultatif)</span><Input type="file" accept="image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><small>{fileName || "Aucune photo sélectionnée"}</small></label>
            <Button className="primary-action confirm-order" type="submit">Envoyer la demande <ArrowRight aria-hidden="true" /></Button>
            {submitted && <p className="form-notice" role="status">Votre idée est prête. Les demandes ne sont pas transmises tant que la boutique n’est pas connectée.</p>}
          </form>
        </div>
      </main>
    </SiteLayout>
  );
}

function SparkleMark() {
  return <Flower2 className="inline-flower" aria-hidden="true" />;
}

export function AboutPage() {
  const values = [
    { icon: <Flower2 aria-hidden="true" />, title: "Fraîcheur", text: "Des fleurs sélectionnées avec attention et composées au meilleur moment." },
    { icon: <Gift aria-hidden="true" />, title: "Création", text: "Chaque bouquet est imaginé à la main, avec sensibilité et générosité." },
    { icon: <Truck aria-hidden="true" />, title: "Livraison", text: "Une attention préparée avec soin, prête à rejoindre ceux que vous aimez." },
  ];

  return (
    <SiteLayout>
      <main className="page-width page-section about-page">
        <p className="eyebrow">Flowers Rafiq</p>
        <h1 className="page-title">Notre histoire</h1>
        <section className="about-story">
          <div className="about-image-wrap"><img src="/flowers/atelier.jpg" alt="L’atelier Flowers Rafiq, avec ses fleurs fraîches et ses bouquets préparés à la main" /><span>Un atelier fleuri, au Maroc</span></div>
          <div className="about-story-copy">
            <p className="eyebrow">Une fleur, une émotion</p>
            <h2>Des attentions pensées avec le cœur</h2>
            <p>Flowers Rafiq est né de l’envie de faire entrer un peu de beauté dans les moments qui comptent. Nous assemblons bouquets, boîtes fleuries et cadeaux avec des fleurs choisies pour leur fraîcheur et leur caractère.</p>
            <p>Chaque création est préparée à la main, avec le souci du détail et la joie simple d’offrir.</p>
            <Button asChild variant="outline" className="outline-action"><Link to="/boutique">Découvrir la boutique <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </section>
        <section className="about-values">
          <SectionHeading eyebrow="Ce qui nous anime" title="De petites attentions, de grandes émotions" />
          <div className="value-grid">
            {values.map((value) => <article className="value-item" key={value.title}><span className="value-icon">{value.icon}</span><h2>{value.title}</h2><p>{value.text}</p></article>)}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <main className="page-width page-section contact-page">
        <p className="eyebrow">Nous sommes à votre écoute</p>
        <h1 className="page-title">Contactez-nous</h1>
        <p className="page-intro">Une question, une envie particulière ? Écrivez-nous, nous serons ravis d’échanger avec vous.</p>
        <div className="contact-layout">
          <div className="contact-details">
            <div className="contact-info-row"><span><MapPin aria-hidden="true" /></span><div><strong>Adresse</strong><p>Au Maroc · ville à préciser</p></div></div>
            <div className="contact-info-row"><span><Clock3 aria-hidden="true" /></span><div><strong>Horaires</strong><p>À confirmer auprès de la boutique</p></div></div>
            <div className="contact-info-row"><span><Instagram aria-hidden="true" /></span><div><strong>Instagram</strong><p>Flowers Rafiq</p></div></div>
            <div className="map-placeholder"><MapPin aria-hidden="true" /><span>Flowers Rafiq · Maroc</span><small>La carte sera ajoutée avec l’adresse de la boutique.</small></div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <h2>Écrivez-nous</h2>
            <label className="form-field"><span>Nom</span><Input required placeholder="Votre nom" /></label>
            <label className="form-field"><span>Téléphone</span><Input type="tel" placeholder="Votre numéro" /></label>
            <label className="form-field"><span>Message</span><Textarea required rows={6} placeholder="Comment pouvons-nous vous aider ?" /></label>
            <div className="contact-actions"><Button type="submit" className="primary-action">Envoyer <ArrowRight aria-hidden="true" /></Button><Button type="button" variant="outline" className="outline-action" onClick={() => setSubmitted(true)}>WhatsApp</Button></div>
            {submitted && <p className="form-notice" role="status">Votre message est prêt. Il ne sera pas transmis tant qu’un contact de boutique n’est pas configuré.</p>}
          </form>
        </div>
      </main>
    </SiteLayout>
  );
}