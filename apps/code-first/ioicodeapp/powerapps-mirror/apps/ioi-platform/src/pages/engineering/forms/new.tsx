import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EngineeringFormNewPage() {
  const navigate = useNavigate();
  const { formCode } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Engineering Form</h1>
          <p className="text-muted-foreground">Form Code: {formCode?.toUpperCase()}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Form Under Development</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This form is being configured. Please check back later.</p>
          <Button className="mt-4" onClick={() => navigate('/engineering')}>Return to Engineering</Button>
        </CardContent>
      </Card>
    </div>
  );
}