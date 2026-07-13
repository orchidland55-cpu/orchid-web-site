import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, Search, Edit, Trash2, MapPin, Calendar, User, ChevronLeft, ChevronRight, Building } from "lucide-react";
import { apiService } from "@/services/api";

interface AdminCareersProps {
  onNavigate?: (view: string, id?: string) => void;
}

const AdminCareers = ({ onNavigate }: AdminCareersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllCareers();
      setCareers(data);
    } catch (err: any) {
      console.error("Error fetching careers:", err);
      setError(err.message || "Error loading careers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers
    .filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || career.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCareers = filteredCareers.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job offer?")) {
      try {
        setDeletingId(id);
        await apiService.deleteCareer(id);
        setCareers((prev) => prev.filter((c) => c._id !== id));
      } catch (error: any) {
        console.error("Error deleting career:", error);
        // Even if error, refetch to confirm
        await fetchCareers();
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Briefcase className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <p className="text-foreground font-medium">Loading careers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchCareers} className="bg-[#D4AF37] hover:bg-[#c9a22a] text-white">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search job offers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {filteredCareers.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCareers.length)} of {filteredCareers.length} job offers
              </div>
            )}
          </CardContent>
        </Card>

        {/* Careers List */}
        <div className="space-y-4">
          {currentCareers.map((career) => (
            <Card
              key={career._id}
              className="hover:shadow-luxury transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {career.title}
                      </h3>
                      {getStatusBadge(career.status)}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{career.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{career.contractType}</span>
                      </div>
                      {career.contractType === "Stage" && career.stageType && (
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{career.stageType}</span>
                        </div>
                      )}
                      {career.salary && (
                        <div className="flex items-center space-x-1">
                          <span>💰 {career.salary}</span>
                        </div>
                      )}
                      {career.duration && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Durée: {career.duration}</span>
                        </div>
                      )}
                      {career.freelanceDeadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(career.freelanceDeadline).toLocaleDateString("fr-FR")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate ? onNavigate("careers-edit", career._id) : null}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(career._id)}
                      disabled={deletingId === career._id}
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
        {totalPages > 1 && (
          <div className="flex flex-col items-center space-y-4 mt-8">
            <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="min-w-[80px]"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="min-w-[80px]"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {filteredCareers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No job offers found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "No job offers match your search criteria."
                  : "Start by creating your first job offer."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminCareers;