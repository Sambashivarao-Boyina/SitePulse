import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import type { Website } from "@/types/Website";

interface WebsiteCardProps {
  website: Website;
  onVisit?: (url: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onVisit }) => {
  const isActive = website.status === "Enable";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <Link to={`/websites/${website._id}`}>
        <Card className="group relative overflow-hidden transition-all  duration-200 hover:shadow-lg hover:shadow-black/5 border-border/50 hover:border-border">
          <CardContent className="p-2 lg:p-4 ">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                    <AvatarImage
                      src={website.logo}
                      alt={`${website.name} logo`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 font-medium text-sm border border-blue-100">
                      {getInitials(website.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                      isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {website.name}
                    </h3>
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={`text-xs px-2 py-0.5 ${
                        isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {website.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="h-3 w-3 flex-shrink-0" />
                    <p className="overflow-hidden line-clamp-1 text-ellipsis max-w-[300px]">
                      {website.url}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {website.lastWebsiteStatus != null && (
                  <Badge
                    className={`uppercase ${
                      isActive ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {website.lastWebsiteStatus?.websiteStatus}
                  </Badge>
                )}
                <div className="flex items-center  opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onVisit?.(website.url)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visit website</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </TooltipProvider>
  );
};

export default WebsiteCard;
