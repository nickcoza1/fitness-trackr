import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../api/activities";
import ActivityList from "./ActivityList";
import ActivityForm from "./ActivityForm";
import { useAuth } from "../auth/AuthContext";

export default function ActivitiesPage() {
  const { token } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  if (isLoading) return <p>Loading activities…</p>;
  if (isError) return <p role="alert">{error?.message || "Failed to load."}</p>;

  return (
    <>
      <h1>Activities</h1>
      <ActivityList activities={data ?? []} />
      {token && <ActivityForm />}
    </>
  );
}
