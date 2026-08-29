import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Send,
  CalendarCheck,
  Car,
  FileSpreadsheet,
  Building2,
  Clock,
  MapPin,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import type { LucideIcon } from 'lucide-react';

interface FormConfig {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const FORM_CONFIGS: Record<string, FormConfig> = {
  rar: {
    code: 'RAR',
    name: 'Room Arrangement Requisition',
    description: 'Request meeting rooms, conference halls, and facility arrangements',
    icon: CalendarCheck,
    color: '#6366f1',
    priority: 'high',
  },
  srf: {
    code: 'SRF',
    name: 'Stationery Requisition Form',
    description: 'Request office supplies, stationery, and consumables',
    icon: FileSpreadsheet,
    color: '#10b981',
    priority: 'medium',
  },
  dar: {
    code: 'DAR',
    name: 'Driver Arrangement Requisition',
    description: 'Request company driver and vehicle services for business travel',
    icon: Car,
    color: '#ef4444',
    priority: 'critical',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

export default function ADMFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const formConfig = useMemo(() => {
    return formCode ? FORM_CONFIGS[formCode.toLowerCase()] : null;
  }, [formCode]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state based on form type
  const [formData, setFormData] = useState({
    // Common fields
    requestorName: user?.fullName || '',
    requestorEmail: user?.userPrincipalName || '',
    department: '',
    purpose: '',
    remarks: '',

    // RAR specific
    roomType: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
    equipment: '',

    // SRF specific
    itemDescription: '',
    quantity: '',
    urgency: 'normal',

    // DAR specific
    pickupLocation: '',
    destination: '',
    passengers: '',
    tripDate: '',
    tripTime: '',
    returnTrip: 'no',
    vehicleType: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    if (isDraft) {
      toast.success('Draft saved successfully!');
    } else {
      toast.success('Form submitted successfully!', {
        description: `Your ${formConfig?.name} has been submitted for approval.`,
      });
      navigate('/adm');
    }
  };

  if (!formConfig) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Form not found. Please select a valid form from the forms library.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/adm/forms">Back to Forms</Link>
        </Button>
      </div>
    );
  }

  const FormIcon = formConfig.icon;

  return (
    <motion.div
      className="p-4 md:p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/adm/forms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${formConfig.color}20` }}
          >
            <FormIcon className="h-8 w-8" style={{ color: formConfig.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{formConfig.name}</h1>
              <Badge
                variant={formConfig.priority === 'critical' ? 'destructive' : 'default'}
              >
                {formConfig.priority}
              </Badge>
            </div>
            <p className="text-muted-foreground">{formConfig.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>Fill in the required information below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Requestor Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Requestor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestorName">Full Name</Label>
                  <Input
                    id="requestorName"
                    value={formData.requestorName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('requestorName', e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestorEmail">Email</Label>
                  <Input
                    id="requestorEmail"
                    type="email"
                    value={formData.requestorEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('requestorEmail', e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value: string) => handleInputChange('department', value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                      <SelectItem value="qc">Quality Control</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* RAR Specific Fields */}
            {formCode?.toLowerCase() === 'rar' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Room Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select
                      value={formData.roomType}
                      onValueChange={(value: string) => handleInputChange('roomType', value)}
                    >
                      <SelectTrigger id="roomType">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting-small">Small Meeting Room (4-6 pax)</SelectItem>
                        <SelectItem value="meeting-medium">Medium Meeting Room (8-12 pax)</SelectItem>
                        <SelectItem value="conference">Conference Room (15-30 pax)</SelectItem>
                        <SelectItem value="boardroom">Board Room</SelectItem>
                        <SelectItem value="training">Training Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      value={formData.attendees}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('attendees', e.target.value)
                      }
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('date', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('startTime', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('endTime', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment Required</Label>
                  <Textarea
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('equipment', e.target.value)
                    }
                    placeholder="e.g., Projector, Whiteboard, Video conferencing setup"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* SRF Specific Fields */}
            {formCode?.toLowerCase() === 'srf' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Stationery Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="itemDescription">Item Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={formData.itemDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange('itemDescription', e.target.value)
                      }
                      placeholder="List the items you need (e.g., A4 Paper x 10 reams, Blue pens x 20, Staplers x 5)"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value: string) => handleInputChange('urgency', value)}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal (3-5 working days)</SelectItem>
                        <SelectItem value="urgent">Urgent (1-2 working days)</SelectItem>
                        <SelectItem value="immediate">Immediate (Same day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* DAR Specific Fields */}
            {formCode?.toLowerCase() === 'dar' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Trip Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('pickupLocation', e.target.value)
                      }
                      placeholder="e.g., Main Office, Block A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('destination', e.target.value)
                      }
                      placeholder="e.g., KLIA, Customer Office"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tripDate">Trip Date</Label>
                    <Input
                      id="tripDate"
                      type="date"
                      value={formData.tripDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('tripDate', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tripTime">Pickup Time</Label>
                    <Input
                      id="tripTime"
                      type="time"
                      value={formData.tripTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('tripTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      value={formData.passengers}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('passengers', e.target.value)
                      }
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Preference</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value: string) => handleInputChange('vehicleType', value)}
                    >
                      <SelectTrigger id="vehicleType">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan (1-4 pax)</SelectItem>
                        <SelectItem value="mpv">MPV (5-7 pax)</SelectItem>
                        <SelectItem value="van">Van (8-12 pax)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnTrip">Return Trip Required</Label>
                    <Select
                      value={formData.returnTrip}
                      onValueChange={(value: string) => handleInputChange('returnTrip', value)}
                    >
                      <SelectTrigger id="returnTrip">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="wait">Yes, driver should wait</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Additional Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / Justification</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange('purpose', e.target.value)
                  }
                  placeholder="Describe the purpose of this request"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange('remarks', e.target.value)
                  }
                  placeholder="Any additional remarks or special requirements"
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}