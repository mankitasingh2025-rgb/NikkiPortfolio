import { ViewAllButton } from "./ViewAllButton";

export const ViewAllButtonDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">View All Button Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Beautiful, animated View All button with multiple variants and sizes
        </p>
      </div>
      
      <div className="flex flex-wrap gap-6 items-center justify-center">
        {/* Primary variants */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Primary Variant</h3>
          <div className="flex gap-4">
            <ViewAllButton size="sm" text="View All Small" />
            <ViewAllButton size="md" text="View All" />
            <ViewAllButton size="lg" text="View All Large" />
          </div>
        </div>
        
        {/* Secondary variants */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Secondary Variant</h3>
          <div className="flex gap-4">
            <ViewAllButton variant="secondary" size="sm" text="View All Small" />
            <ViewAllButton variant="secondary" size="md" text="View All" />
            <ViewAllButton variant="secondary" size="lg" text="View All Large" />
          </div>
        </div>
        
        {/* Outline variants */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Outline Variant</h3>
          <div className="flex gap-4">
            <ViewAllButton variant="outline" size="sm" text="View All Small" />
            <ViewAllButton variant="outline" size="md" text="View All" />
            <ViewAllButton variant="outline" size="lg" text="View All Large" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Custom Examples</h3>
        <div className="flex gap-4 flex-wrap justify-center">
          <ViewAllButton 
            text="View Portfolio" 
            href="/portfolio"
            variant="primary"
            className="shadow-2xl"
          />
          <ViewAllButton 
            text="Explore Projects" 
            href="/explore"
            variant="secondary"
            showIcon={true}
          />
          <ViewAllButton 
            text="See All Work" 
            href="/work"
            variant="outline"
            showIcon={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewAllButtonDemo;
