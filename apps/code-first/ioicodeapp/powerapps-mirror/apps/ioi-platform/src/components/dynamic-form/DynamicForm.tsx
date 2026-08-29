import { type ReactNode, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SectionRenderer } from './SectionRenderer';
import { useDynamicForm, isSectionVisible } from '@/hooks/use-dynamic-form';
import { useFormSchemaFromSP } from '@/hooks/use-form-schema';
import type { FormSchema } from '@/types/form-schema';

interface DynamicFormProps {
  schema: FormSchema;
  icon?: ReactNode;
}

export function DynamicForm({ schema: defaultSchema, icon }: DynamicFormProps) {
  const navigate = useNavigate();
  const goBack = useCallback(() => navigate(-1), [navigate]);
  const spSchema = useFormSchemaFromSP(defaultSchema.formCode);
  const schema = spSchema ?? defaultSchema;
  const { values, errors, isPending, setValue, handleSubmit } = useDynamicForm({ schema });

  const visibleSections = schema.sections
    .filter(section => isSectionVisible(section, values))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const onSubmit = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e, recordNo => {
        toast.success(`${schema.title} submitted! Ref: ${recordNo}`);
        navigate(schema.routeBase);
      });
    } catch (error) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="h-16 bg-[#003366] px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{schema.title}</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New {schema.title}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          className="space-y-6"
        >
          {visibleSections.map(section => (
            <SectionRenderer
              key={section.sectionId}
              section={section}
              values={values}
              errors={errors}
              onFieldChange={setValue}
            />
          ))}

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate(schema.routeBase)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#003366] hover:bg-[#002244] text-white"
            >
              {icon && <span className="mr-2 flex items-center">{icon}</span>}
              {isPending ? 'Submitting...' : `Submit ${schema.title}`}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
