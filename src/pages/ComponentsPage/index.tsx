const ComponentsPage = () => {    
    return (
        <div className="flex mx-16 flex-col">
        <h1 className="text-3xl font-bold my-4 ">Colour/Components Display</h1>
        <h2 className="text-2xl font-bold my-4">Colour Pairs</h2>
            <div className="grid-cols-2 grid items-center justify-center gap-4 bg-neutral-600 p-4 rounded-xl">
                <div className="h-32 rounded-xl flex items-center justify-center bg-background text-foreground">Background</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-card text-card-foreground">Card</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-popover text-popover-foreground">Popover</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">Primary</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-secondary text-secondary-foreground">Secondary</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-muted text-muted-foreground">Muted</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-accent text-accent-foreground">Accent</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-destructive text-destructive-foreground">Destructive</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-success text-success-foreground">Success</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-warning text-warning-foreground">Warning</div>
            </div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Indiviual colours</h2>
            <div className="flex flex-col gap-4 p-4 bg-neutral-600 rounded-xl   ">
                <div className="h-32 rounded-xl flex items-center justify-center bg-border text-background">Border</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-input text-background">Input</div>
                <div className="h-32 rounded-xl flex items-center justify-center bg-ring text-foreground">Ring</div>

            </div>
        </div>
    );
};

export default ComponentsPage;