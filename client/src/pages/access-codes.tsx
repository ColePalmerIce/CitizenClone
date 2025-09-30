import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AccessCodesPage() {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: accessCodes, isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/public/access-codes'],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: "Code Copied!",
        description: "Access code has been copied to clipboard",
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Active Access Codes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Use any of these codes to login to your banking account
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Auto-refreshing every 30 seconds</span>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2"
            data-testid="button-refresh-codes"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Now
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Access Codes Grid */}
        {!isLoading && accessCodes && accessCodes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessCodes.map((code) => (
              <Card
                key={code.id}
                className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800"
                data-testid={`access-code-card-${code.id}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600 dark:text-gray-300 font-normal">
                    Access Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* The Code */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-center">
                      <div className="text-3xl font-mono font-bold text-white tracking-wider">
                        {code.code}
                      </div>
                    </div>

                    {/* User Assignment */}
                    {code.username && (
                      <div className="text-sm text-center">
                        <span className="text-gray-500 dark:text-gray-400">Assigned to: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {code.username}
                        </span>
                      </div>
                    )}

                    {!code.username && (
                      <div className="text-sm text-center text-green-600 dark:text-green-400 font-semibold">
                        Available for any user
                      </div>
                    )}

                    {/* Copy Button */}
                    <Button
                      onClick={() => handleCopyCode(code.code)}
                      className="w-full gap-2"
                      variant={copiedCode === code.code ? "secondary" : "default"}
                      data-testid={`button-copy-code-${code.id}`}
                    >
                      {copiedCode === code.code ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </Button>

                    {/* Status */}
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 dark:text-gray-400">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Codes */}
        {!isLoading && (!accessCodes || accessCodes.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No Active Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access codes will appear here automatically
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Use Access Codes
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Copy any active access code from above</li>
              <li>• Go to the login page and enter your username/email and password</li>
              <li>• Paste the access code when prompted</li>
              <li>• Codes refresh automatically every 30 seconds</li>
              <li>• Some codes are assigned to specific users, others work for anyone</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
