import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    meetingType: "",
    timeSlot: "",
    message: ""
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const meetingTypes = [
    { value: "consultation", label: "Consultation gratuite" },
    { value: "property-viewing", label: "Visite de propriété" },
    { value: "investment", label: "Conseil en investissement" },
    { value: "selling", label: "Vendre ma propriété" },
    { value: "other", label: "Autre" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      ...formData,
      date: selectedDate?.toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    console.log("Meeting scheduled:", meetingData);
    
    // Here you would typically send the data to your backend
    alert(`Rendez-vous programmé pour le ${selectedDate?.toLocaleDateString('fr-FR')} à ${formData.timeSlot}. Nous vous confirmerons par email.`);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      meetingType: "",
      timeSlot: "",
      message: ""
    });
    setSelectedDate(new Date());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <span>Planifier un Rendez-vous</span>
          </DialogTitle>
          <DialogDescription>
            Choisissez une date et un créneau horaire qui vous conviennent. Nous vous confirmerons votre rendez-vous par email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Calendar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Sélectionnez une date</span>
              </h3>
              <div className="border rounded-lg p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md"
                />
              </div>
              
              {selectedDate && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Créneaux disponibles</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.timeSlot === time ? "luxury" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, timeSlot: time }))}
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Vos informations</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX-XXX-XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de rendez-vous *</label>
                  <Select
                    value={formData.meetingType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez le type de rendez-vous" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez brièvement vos besoins ou questions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedDate && formData.timeSlot && formData.name && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">Résumé de votre rendez-vous</h4>
              <div className="text-sm space-y-1">
                <p><strong>Date:</strong> {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Heure:</strong> {formData.timeSlot}</p>
                <p><strong>Type:</strong> {meetingTypes.find(t => t.value === formData.meetingType)?.label}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="luxury"
              disabled={!selectedDate || !formData.timeSlot || !formData.name || !formData.email || !formData.phone || !formData.meetingType}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Confirmer le rendez-vous
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;
