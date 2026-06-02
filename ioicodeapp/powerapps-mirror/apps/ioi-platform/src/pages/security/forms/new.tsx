import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { MainDBSECService } from '@/generated/services/main-dbsec-service';

const FORM_CONFIGS: Record<string, { title: string; fields: string[] }> = {
  vr: { title: 'Visitor Registration', fields: ['visitorName', 'company', 'contactNumber', 'purpose', 'hostName', 'visitDate'] },
  vp: { title: 'Visitor Pass', fields: ['visitorName', 'passType', 'validFrom', 'validTo', 'areas'] },
  vl: { title: 'Visitor Log', fields: ['date', 'totalVisitors', 'remarks'] },
  ve: { title: 'Vehicle Entry', fields: ['vehicleNumber', 'vehicleType', 'driverName', 'purpose', 'destination'] },
  pp: { title: 'Parking Permit', fields: ['vehicleNumber', 'ownerName', 'department', 'permitType', 'validUntil'] },
  vx: { title: 'Vehicle Exit', fields: ['vehicleNumber', 'exitTime', 'remarks'] },
  ki: { title: 'Key Issuance', fields: ['keyType', 'keyNumber', 'issuedTo', 'department', 'purpose'] },
  kr: { title: 'Key Return', fields: ['keyType', 'keyNumber', 'returnedBy', 'condition'] },
  ac: { title: 'Access Card Request', fields: ['employeeName', 'employeeId', 'department', 'accessLevel', 'reason'] },
  pr: { title: 'Patrol Report', fields: ['patrolDate', 'shift', 'areas', 'findings', 'actionTaken'] },
};

export default function SecurityFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = FORM_CONFIGS[formCode?.toLowerCase() || ''] || { title: 'Security Form', fields: [] };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await MainDBSECService.create({
        title: `${config.title} - ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
        formCode: formCode?.toUpperCase() || '',
        department: 'Security',
        submittedBy: user?.email || '',
        submittedOn: new Date().toISOString(),
      });

      toast.success('Form submitted successfully');
      navigate('/security');
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">Create new {config.title.toLowerCase()} record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto-generated fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-muted-foreground">Request Number</Label>
                <p className="font-mono font-medium">{format(new Date(), 'yyyy-MM')}-0001</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date Created</Label>
                <p className="font-medium">{format(new Date(), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Requested By</Label>
                <p className="font-medium">{user?.fullName || 'Loading...'}</p>
              </div>
            </div>

            {/* Dynamic form fields based on form type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formCode?.toLowerCase() === 'vr' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="visitorName">Visitor Name *</Label>
                    <Input id="visitorName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostName">Host Name *</Label>
                    <Input id="hostName" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="purpose">Purpose of Visit *</Label>
                    <Textarea id="purpose" required />
                  </div>
                </>
              )}

              {formCode?.toLowerCase() === 've' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input id="vehicleNumber" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name *</Label>
                    <Input id="driverName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input id="destination" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Textarea id="purpose" required />
                  </div>
                </>
              )}

              {formCode?.toLowerCase() === 'ki' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="keyType">Key Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select key type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office Key</SelectItem>
                        <SelectItem value="cabinet">Cabinet Key</SelectItem>
                        <SelectItem value="room">Room Key</SelectItem>
                        <SelectItem value="gate">Gate Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyNumber">Key Number *</Label>
                    <Input id="keyNumber" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuedTo">Issued To *</Label>
                    <Input id="issuedTo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Textarea id="purpose" required />
                  </div>
                </>
              )}

              {/* Default fields for other form types */}
              {!['vr', 've', 'ki'].includes(formCode?.toLowerCase() || '') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="field1">Field 1 *</Label>
                    <Input id="field1" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field2">Field 2</Label>
                    <Input id="field2" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea id="remarks" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="button" variant="secondary">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
