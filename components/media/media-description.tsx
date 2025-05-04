import React from "react";

interface MediaDescriptionProps {
  description: string;
}

export default function MediaDescription({
  description,
}: MediaDescriptionProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <h2 className="text-xl font-semibold mb-3">Description</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
