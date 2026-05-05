import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { apiService, Article } from "@/services/api";

const AdminArticles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllArticles();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Error loading articles");
    } finally {
      setLoading(false);
    }
  };

  // Extraire les catégories uniques
  const categories = Array.from(
    new Set(articles.map(article => article.category).filter(Boolean))
  ).sort();

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || article.status === filterStatus;

    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const siblingCount = 1;
    const pageNumbers: (number | string)[] = [];

    // Toujours afficher la première page
    pageNumbers.push(1);

    // Calculer la plage de pages à afficher autour de la page actuelle
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

    // Afficher les pointillés à gauche si nécessaire
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // Si on est proche du début (pages 1-4)
    if (!showLeftDots && showRightDots) {
      const leftRange = 3 + 2 * siblingCount;
      for (let i = 2; i <= Math.min(leftRange, totalPages - 1); i++) {
        pageNumbers.push(i);
      }
      if (totalPages > leftRange + 1) {
        pageNumbers.push('...');
      }
    }
    // Si on est proche de la fin
    else if (showLeftDots && !showRightDots) {
      pageNumbers.push('...');
      const rightRange = 3 + 2 * siblingCount;
      for (let i = Math.max(totalPages - rightRange, 2); i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }
    // Si on est au milieu
    else if (showLeftDots && showRightDots) {
      pageNumbers.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
    }
    // Si le nombre total de pages est petit (moins de 7 pages)
    else {
      for (let i = 2; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }

    // Toujours afficher la dernière page (si elle existe et n'est pas la première)
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        {/* Navigation avec boutons */}
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="min-w-[80px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </Button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === '...') {
                return (
                  <span key={`dots-${index}`} className="px-3 text-muted-foreground">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "luxury" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber as number)}
                  className={`min-w-[40px] ${currentPage === pageNumber ? "text-white" : ""}`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="min-w-[80px]"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Info sur la page actuelle */}
        <p className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      // <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 luxury-gradient rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-foreground font-medium">
              Loading articles...
            </p>
          </div>
        </div>
      // </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <header className="bg-white border-b border-border shadow-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/admin/dashboard">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Article Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Manage blog articles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-6 py-8">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Loading Error
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchArticles} variant="luxury">
                  Retry
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </PageTransition>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Published
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        setDeletingId(id);
        await apiService.deleteArticle(id);
        await fetchArticles();
        alert("Article deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting article:", error);
        alert(`Error deleting: ${error.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    // <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Article Management
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage blog articles
                  </p>
                </div>
              </div>
              <Link to="/admin/articles/add">
                <Button variant="luxury">
                  <Plus className="w-4 h-4 mr-2" /> New Article
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Category Filter - Dynamique */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              {filteredArticles.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArticles.length)} sur {filteredArticles.length} articles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Articles List */}
          <div className="space-y-4">
            {currentArticles.map((article) => (
              <Card
                key={article._id}
                className="hover:shadow-luxury transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {article.title}
                        </h3>
                        {getStatusBadge(article.status)}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        {/* Person added after author */}
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{article.person || "—"}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.createdAt).toLocaleDateString("en-US")}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link to={`/admin/articles/edit/${article._id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/blog/${article._id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article._id)}
                        disabled={deletingId === article._id}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "No articles match your search criteria."
                    : "Start by creating your first article."}
                </p>
                <Link to="/admin/articles/add">
                  <Button variant="luxury">
                    <Plus className="w-4 h-4 mr-2" /> Create Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    //  </PageTransition> 
  );
};

export default AdminArticles;