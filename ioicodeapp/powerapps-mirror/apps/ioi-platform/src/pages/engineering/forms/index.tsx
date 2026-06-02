import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EngineeringFormsIndexPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/engineering')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Engineering Forms</h1>
          <p className="text-muted-foreground">All engineering department forms</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Forms Directory</CardTitle>
          <CardDescription>Select a form from the Engineering home page to view its database or create a new submission.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/engineering')}>Go to Engineering Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}