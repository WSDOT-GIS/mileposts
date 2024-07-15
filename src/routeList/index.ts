import { milepostsUrl } from "..";

const srmpFieldName = "SRMP";
const routeIdFieldName = "RouteID";
const directionFieldName = "Direction";
const minSrmpFieldName = "MinSrmp";
const maxSrmpFieldName = "MaxSrmp";

const outStatistics = [
  {
    statisticType: "MIN",
    onStatisticField: srmpFieldName,
    outStatisticFieldName: minSrmpFieldName,
  },
  {
    statisticType: "MAX",
    onStatisticField: srmpFieldName,
    outStatisticFieldName: maxSrmpFieldName,
  },
] as const;

interface FeatureAttributes {
  RouteID: string;
  Direction: "i" | "d";
  MinSrmp: number;
  MaxSrmp: number;
}

interface Feature {
  attributes: FeatureAttributes;
}

interface FeatureSet extends Record<string, unknown> {
  displayFieldName: "";
  fieldAliases: {
    RouteID: typeof routeIdFieldName;
    Direction: typeof directionFieldName;
    MinSrmp: typeof minSrmpFieldName;
    MaxSrmp: typeof maxSrmpFieldName;
  };
  fields: [
    {
      name: typeof routeIdFieldName;
      type: "esriFieldTypeString";
      alias: typeof routeIdFieldName;
      length: 12;
    },
    {
      name: typeof directionFieldName;
      type: "esriFieldTypeString";
      alias: typeof directionFieldName;
      length: 2;
    },
    {
      name: typeof minSrmpFieldName;
      type: "esriFieldTypeSingle";
      alias: typeof minSrmpFieldName;
    },
    {
      name: typeof maxSrmpFieldName;
      type: "esriFieldTypeSingle";
      alias: typeof maxSrmpFieldName;
    },
  ];
  features: Feature[];
}

export function isValidFeatureSet(input: unknown): input is FeatureSet {
  if (typeof input !== "object" && input != null) {
    return false;
  }
  return (
    typeof input === "object" &&
    input != null &&
    Object.hasOwn(input, "features")
  );
}

/**
 * Retrieves a list of all route IDs and their minimum and maximum SRMP values.
 * @returns - A list of route IDs and their minimum and maximum SRMP values.
 */
export async function getRouteList(layerUrl = milepostsUrl) {
  // Append a trailing slash to layerUrl if it is not already present.
  if (!layerUrl.endsWith("/")) {
    layerUrl += "/";
  }
  const fieldPairString = `${routeIdFieldName},${directionFieldName}`;
  const search = new URLSearchParams([
    ["outStatistics", JSON.stringify(outStatistics, undefined, 0)],
    ["returnGeometry", "false"],
    ["groupByFieldsForStatistics", fieldPairString],
    ["orderByFields", fieldPairString],
    ["f", "json"],
  ]);
  const url = new URL(`query?${search.toString()}`, layerUrl);
  console.log("url", url);
  const response = await fetch(url);
  const featureSet = await response.json();
  if (!isValidFeatureSet(featureSet)) {
    throw new Error(`Invalid feature set: ${JSON.stringify(featureSet)}`);
  }
  console.log("featureSet", featureSet);
  const results: FeatureAttributes[] = featureSet.features.map(
    (feature) => feature.attributes
  );
  return results;
}
