import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediaDescriptionProps {
  description: string;
}

export default function MediaDescription({
  description,
}: MediaDescriptionProps) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">
          {description.split("\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
