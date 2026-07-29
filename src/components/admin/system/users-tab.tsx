"use client";

import { useState, useMemo } from "react";

export interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  role: {
    name: string;
    description: string | null;
  };
}

interface UsersTabProps {
  initialUsers: User[];
  onLogAudit: (msg: string) => void;
}

export function UsersTab({ initialUsers, onLogAudit }: UsersTabProps) {
  const [users] = useState<User[]>(initialUsers);
  const [revokedUsers, setRevokedUsers] = useState<Record<string, boolean>>({});
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.name.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const toggleUserAccess = (id: string, email: string) => {
    const nextRevoked = !revokedUsers[id];
    setRevokedUsers((prev) => ({
      ...prev,
      [id]: nextRevoked,
    }));
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    onLogAudit(`${timestamp} - User "${email}" access ${nextRevoked ? "REVOKED" : "RESTORED"} by system@educore.com`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-editorial text-3xl font-bold text-ink mb-2">Platform User Directory</h2>
        <p className="font-body-sm text-ink/70">
          Audit system access and manage credentials for corporate staff and candidates.
        </p>
      </div>

      {/* Search Users Bar */}
      <div className="bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-label-caps text-xs text-ink font-bold tracking-wide">Search Users</label>
          <input
            type="text"
            placeholder="Filter by name, email or role..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="border-2 border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-border bg-paper shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-border bg-ink/5">
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">User</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Email</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Role</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Joined</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Status</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-dotted divide-border">
            {filteredUsers.map((u) => {
              const isRevoked = !!revokedUsers[u.id];
              let roleBadgeColor = "bg-gray-50 border-gray-400 text-gray-700";
              if (u.role.name === "HR_ADMIN") roleBadgeColor = "bg-orange-50 border-orange-500 text-orange-600";
              else if (u.role.name === "TECH_ADMIN") roleBadgeColor = "bg-blue-50 border-blue-500 text-blue-600";
              else if (u.role.name === "SYSTEM_ADMIN") roleBadgeColor = "bg-purple-50 border-purple-500 text-purple-600";

              return (
                <tr key={u.id} className="hover:bg-ink/5 transition-all duration-150">
                  <td className="py-5 px-6">
                    <div className="font-bold text-sm text-ink">{u.name || "Unnamed User"}</div>
                  </td>
                  <td className="py-5 px-6 font-label-caps text-xs">{u.email}</td>
                  <td className="py-5 px-6">
                    <span className={`font-label-caps text-[10px] px-3 py-1.5 border-2 font-bold ${roleBadgeColor}`}>
                      {u.role.name}
                    </span>
                  </td>
                  <td className="py-5 px-6 font-label-caps text-xs text-ink/60">
                    {new Date(u.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`font-label-caps text-[10px] px-3 py-1.5 border-2 font-bold ${
                        isRevoked ? "bg-rose-50 border-rose-300 text-rose-600 shadow-[2px_2px_0px_0px_rgba(225,29,72,0.3)]" : "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {isRevoked ? "REVOKED" : "ACTIVE"}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    {u.role.name !== "SYSTEM_ADMIN" ? (
                      <button
                        onClick={() => toggleUserAccess(u.id, u.email)}
                        className={`font-label-caps text-xs px-4 py-2 border-2 transition-all duration-200 cursor-pointer ${
                          isRevoked
                            ? "bg-transparent border-ink text-ink hover:bg-ink hover:text-paper hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
                            : "bg-transparent border-coral text-coral hover:bg-coral hover:text-ink hover:border-ink hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
                        }`}
                      >
                        {isRevoked ? "Restore" : "Revoke"}
                      </button>
                    ) : (
                      <span className="text-ink/40 font-label-caps text-xs select-none border-2 border-transparent px-4 py-2">Protected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
