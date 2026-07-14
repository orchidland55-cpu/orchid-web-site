import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { showToast } from "@/components/ToastContainer";
import { apiService } from "@/services/api";

const CONTACTS_PER_PAGE = 5;

const AdminContacts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/admin");
      return;
    }
    loadContacts();
  }, [navigate]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getAllContacts();
      const transformedContacts = result.data.map((c: any) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone || "Not provided",
        subject: c.subject || "No subject",
        message: c.message,
        propertyType: c.propertyType || "Not specified",
        date: c.date ? new Date(c.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        time: c.date
          ? new Date(c.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "00:00",
        status: c.status || "new",
        priority: "medium"
      }));
      setContacts(transformedContacts);
    } catch (error) {
      showToast({
        type: "error",
        title: "Loading Error",
        message: "Unable to load contacts"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!window.confirm("Do you want to delete this request?")) return;

    setIsLoading(true);
    try {
      await apiService.deleteContact(contactId);
      showToast({
        type: "success",
        title: "Contact Deleted",
        message: "The request has been successfully deleted",
        duration: 3000
      });
      await loadContacts();
    } catch (error) {
      showToast({
        type: "error",
        title: "Error",
        message: "Unable to delete contact.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      setContacts(prev =>
        prev.map(contact => (contact.id === contactId ? { ...contact, status: newStatus } : contact))
      );
      await apiService.updateContactStatus(contactId, newStatus);
      showToast({
        type: "success",
        title: "Status Updated",
        message: `Status changed to "${newStatus === 'répondu' ? 'Replied' : newStatus === 'planifier' ? 'Scheduled' : 'New'}"`,
        duration: 3000
      });
    } catch (error) {
      await loadContacts();
      showToast({
        type: "error",
        title: "Error",
        message: "Unable to update status. Please try again.",
        duration: 3000
      });
    }
  };

  const toggleMessageExpand = (contactId: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
      }
      return next;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">New</Badge>;
      case "répondu":
        return <Badge variant="default" className="bg-green-100 text-green-800">Replied</Badge>;
      case "planifier":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE));
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * CONTACTS_PER_PAGE,
    currentPage * CONTACTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const stats = {
    total: contacts.length,
    newCount: contacts.filter(c => c.status === "new").length,
    repliedCount: contacts.filter(c => c.status === "répondu").length,
    scheduledCount: contacts.filter(c => c.status === "planifier").length
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-8">

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
                </div>
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Replied</p>
                  <p className="text-2xl font-bold text-green-600">{stats.repliedCount}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.scheduledCount}</p>
                </div>
                <Calendar className="w-6 h-6 text-yellow-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Mail className="w-6 h-6 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All statuses</option>
                  <option value="new">New</option>
                  <option value="répondu">Replied</option>
                  <option value="planifier">Scheduled</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          {!isLoading && filteredContacts.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {(currentPage - 1) * CONTACTS_PER_PAGE + 1}–{Math.min(currentPage * CONTACTS_PER_PAGE, filteredContacts.length)} of {filteredContacts.length} request{filteredContacts.length > 1 ? "s" : ""}
            </p>
          )}

          {/* Contact list or loader */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading contacts...</p>
              </CardContent>
            </Card>
          ) : filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "No requests match your criteria."
                    : "No contact requests at the moment."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedContacts.map(contact => {
                const isExpanded = expandedMessages.has(contact.id);
                const isLongMessage = contact.message && contact.message.length > 150;

                return (
                  <Card key={contact.id} className="hover:shadow-luxury transition-all duration-300 mb-4">
                    <CardContent className="p-6 flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getPriorityIcon(contact.priority)}
                          <h3 className="text-lg font-bold text-foreground">{contact.name}</h3>
                          {getStatusBadge(contact.status)}
                          <Badge variant="outline" className="text-xs">{contact.propertyType}</Badge>
                        </div>

                        <h4 className="text-md font-semibold text-foreground mb-2">{contact.subject}</h4>

                        {/* Message with expand/collapse */}
                        <div className="mb-4">
                          <p className={`text-muted-foreground ${!isExpanded && isLongMessage ? "line-clamp-2" : ""}`}>
                            {contact.message}
                          </p>
                          {isLongMessage && (
                            <button
                              onClick={() => toggleMessageExpand(contact.id)}
                              className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline focus:outline-none"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  Read more
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2"><Mail className="w-4 h-4" /><span>{contact.email}</span></div>
                          <div className="flex items-center space-x-2"><Phone className="w-4 h-4" /><span>{contact.phone}</span></div>
                          <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{new Date(contact.date).toLocaleDateString('en-US')}</span></div>
                          <div className="flex items-center space-x-2"><Clock className="w-4 h-4" /><span>{contact.time}</span></div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                          className="px-3 py-1 text-xs border border-input rounded-md bg-background"
                        >
                          <option value="new">New</option>
                          <option value="répondu">Replied</option>
                          <option value="planifier">Scheduled</option>
                        </select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground select-none">
                        …
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        className="w-9 h-9 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminContacts;
