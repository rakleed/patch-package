"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatchDetailsFromCliString = exports.getPackageDetailsFromPatchFilename = exports.parseNameAndVersion = void 0;
const path_1 = require("./path");
function parseNameAndVersion(str) {
    const parts = str
        .split("+")
        .map((s) => s.trim())
        .filter(Boolean);
    if (parts.length === 0) {
        return null;
    }
    if (parts.length === 1) {
        return { packageName: str };
    }
    const versionIndex = parts.findIndex((part) => part.match(/^\d+\.\d+\.\d+.*$/));
    if (versionIndex === -1) {
        const [scope, name] = parts;
        return { packageName: `${scope}/${name}` };
    }
    const nameParts = parts.slice(0, versionIndex);
    let packageName;
    switch (nameParts.length) {
        case 0:
            return null;
        case 1:
            packageName = nameParts[0];
            break;
        case 2:
            const [scope, name] = nameParts;
            packageName = `${scope}/${name}`;
            break;
        default:
            return null;
    }
    const version = parts[versionIndex];
    const sequenceParts = parts.slice(versionIndex + 1);
    if (sequenceParts.length === 0) {
        return { packageName, version };
    }
    // expect sequenceParts[0] to be a number, strip leading 0s
    const sequenceNumber = parseInt(sequenceParts[0].replace(/^0+/, ""), 10);
    if (isNaN(sequenceNumber)) {
        return null;
    }
    switch (sequenceParts.length) {
        case 1: {
            return { packageName, version, sequenceNumber };
        }
        case 2: {
            return {
                packageName,
                version,
                sequenceName: sequenceParts[1],
                sequenceNumber,
            };
        }
        default: {
            return null;
        }
    }
    return null;
}
exports.parseNameAndVersion = parseNameAndVersion;
function getPackageDetailsFromPatchFilename(patchFilename) {
    const parts = patchFilename
        .replace(/(\.dev)?\.patch$/, "")
        .split("++")
        .map(parseNameAndVersion)
        .filter((x) => x !== null);
    if (parts.length === 0) {
        return null;
    }
    const lastPart = parts[parts.length - 1];
    if (!lastPart.version) {
        return null;
    }
    return {
        name: lastPart.packageName,
        version: lastPart.version,
        path: path_1.join("node_modules", parts.map(({ packageName: name }) => name).join("/node_modules/")),
        patchFilename,
        pathSpecifier: parts.map(({ packageName: name }) => name).join("/"),
        humanReadablePathSpecifier: parts
            .map(({ packageName: name }) => name)
            .join(" => "),
        isNested: parts.length > 1,
        packageNames: parts.map(({ packageName: name }) => name),
        isDevOnly: patchFilename.endsWith(".dev.patch"),
        sequenceName: lastPart.sequenceName,
        sequenceNumber: lastPart.sequenceNumber,
    };
}
exports.getPackageDetailsFromPatchFilename = getPackageDetailsFromPatchFilename;
function getPatchDetailsFromCliString(specifier) {
    const parts = specifier.split("/");
    const packageNames = [];
    let scope = null;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith("@")) {
            if (scope) {
                return null;
            }
            scope = parts[i];
        }
        else {
            if (scope) {
                packageNames.push(`${scope}/${parts[i]}`);
                scope = null;
            }
            else {
                packageNames.push(parts[i]);
            }
        }
    }
    const path = path_1.join("node_modules", packageNames.join("/node_modules/"));
    return {
        packageNames,
        path,
        name: packageNames[packageNames.length - 1],
        humanReadablePathSpecifier: packageNames.join(" => "),
        isNested: packageNames.length > 1,
        pathSpecifier: specifier,
    };
}
exports.getPatchDetailsFromCliString = getPatchDetailsFromCliString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2FnZURldGFpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGFja2FnZURldGFpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTZCO0FBbUI3QixTQUFnQixtQkFBbUIsQ0FDakMsR0FBVztJQU9YLE1BQU0sS0FBSyxHQUFHLEdBQUc7U0FDZCxLQUFLLENBQUMsR0FBRyxDQUFDO1NBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxJQUFJLENBQUE7S0FDWjtJQUNELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQTtLQUM1QjtJQUNELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQ2hDLENBQUE7SUFDRCxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN2QixNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQTtRQUMzQixPQUFPLEVBQUUsV0FBVyxFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUE7S0FDM0M7SUFDRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUM5QyxJQUFJLFdBQVcsQ0FBQTtJQUNmLFFBQVEsU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUN4QixLQUFLLENBQUM7WUFDSixPQUFPLElBQUksQ0FBQTtRQUNiLEtBQUssQ0FBQztZQUNKLFdB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Z0IsQ0FBQyxDQUFDLENBQUE7SUFFdEUsT0FBTztRQUNMLFlBQVk7UUFDWixJQUFJO1FBQ0osSUFBSSxFQUFFLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzQywwQkFBMEIsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyRCxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ2pDLGFBQWEsRUFBRSxTQUFTO0tBQ3pCLENBQUE7QUFDSCxDQUFDO0FBbkNELG9FQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tIFwiLi9wYXRoXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYWNrYWdlRGV0YWlscyB7XG4gIGh1bWFuUmVhZGFibGVQYXRoU3BlY2lmaWVyOiBzdHJpbmdcbiAgcGF0aFNwZWNpZmllcjogc3RyaW5nXG4gIHBhdGg6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgaXNOZXN0ZWQ6IGJvb2xlYW5cbiAgcGFja2FnZU5hbWVzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGNoZWRQYWNrYWdlRGV0YWlscyBleHRlbmRzIFBhY2thZ2VEZXRhaWxzIHtcbiAgdmVyc2lvbjogc3RyaW5nXG4gIHBhdGNoRmlsZW5hbWU6IHN0cmluZ1xuICBpc0Rldk9ubHk6IGJvb2xlYW5cbiAgc2VxdWVuY2VOYW1lPzogc3RyaW5nXG4gIHNlcXVlbmNlTnVtYmVyPzogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU5hbWVBbmRWZXJzaW9uKFxuICBzdHI6IHN0cmluZyxcbik6IHtcbiAgcGFja2FnZU5hbWU6IHN0cmluZ1xuICB2ZXJzaW9uPzogc3RyaW5nXG4gIHNlcXVlbmNlTmFtZT86IHN0cmluZ1xuICBzZXF1ZW5jZU51bWJlcj86IG51bWJlclxufSB8IG51bGwge1xuICBjb25zdCBwYXJ0cyA9IHN0clxuICAgIC5zcGxpdChcIitcIilcbiAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pXG4gIGlmIChwYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4geyBwYWNrYWdlTmFtZTogc3RyIH1cbiAgfVxuICBjb25zdCB2ZXJzaW9uSW5kZXggPSBwYXJ0cy5maW5kSW5kZXgoKHBhcnQpID0+XG4gICAgcGFydC5tYXRjaCgvXlxcZCtcXC5cXGQrXFwuXFxkKy4qJC8pLFxuICApXG4gIGlmICh2ZXJzaW9uSW5kZXggPT09IC0xKSB7XG4gICAgY29uc3QgW3Njb3BlLCBuYW1lXSA9IHBhcnRzXG4gICAgcmV0dXJuIHsgcGFja2FnZU5hbWU6IGAke3Njb3BlfS8ke25hbWV9YCB9XG4gIH1cbiAgY29uc3QgbmFtZVBhcnRzID0gcGFydHMuc2xpY2UoMCwgdmVyc2lvbkluZGV4KVxuICBsZXQgcGFja2FnZU5hbWVcbiAgc3dpdGNoIChuYW1lUGFydHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIG51bGxcbiAgICBjYXNlIDE6XG4gICAgICBwYWNrYWdlTmFtZSA9IG5hbWVQYXJ0c1swXVxuICAgICAgYnJlYWtcbiAgICBjYXNlIDI6XG4gICAgICBjb25zdCBbc2NvcGUsIG5hbWVdID0gbmFtZVBhcnRzXG4gICAgICBwYWNrYWdlTmFtZSA9IGAke3Njb3BlfS8ke25hbWV9YFxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IHZlcnNpb24gPSBwYXJ0c1t2ZXJzaW9uSW5kZXhdXG4gIGNvbnN0IHNlcXVlbmNlUGFydHMgPSBwYXJ0cy5zbGljZSh2ZXJzaW9uSW5kZXggKyAxKVxuICBpZiAoc2VxdWVuY2VQYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4geyBwYWNrYWdlTmFtZSwgdmVyc2lvbiB9XG4gIH1cblxuICAvLyBleHBlY3Qgc2VxdWVuY2VQYXJ0c1swXSB0byBiZSBhIG51bWJlciwgc3RyaXAgbGVhZGluZyAwc1xuICBjb25zdCBzZXF1ZW5jZU51bWJlciA9IHBhcnNlSW50KHNlcXVlbmNlUGFydHNbMF0ucmVwbGFjZSgvXjArLywgXCJcIiksIDEwKVxuICBpZiAoaXNOYU4oc2VxdWVuY2VOdW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBzd2l0Y2ggKHNlcXVlbmNlUGFydHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOiB7XG4gICAgICByZXR1cm4geyBwYWNrYWdlTmFtZSwgdmVyc2lvbiwgc2VxdWVuY2VOdW1iZXIgfVxuICAgIH1cbiAgICBjYXNlIDI6IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhY2thZ2VOYW1lLFxuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBzZXF1ZW5jZU5hbWU6IHNlcXVlbmNlUGFydHNbMV0sXG4gICAgICAgIHNlcXVlbmNlTnVtYmVyLFxuICAgICAgfVxuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFja2FnZURldGFpbHNGcm9tUGF0Y2hGaWxlbmFtZShcbiAgcGF0Y2hGaWxlbmFtZTogc3RyaW5nLFxuKTogUGF0Y2hlZFBhY2thZ2VEZXRhaWxzIHwgbnVsbCB7XG4gIGNvbnN0IHBhcnRzID0gcGF0Y2hGaWxlbmFtZVxuICAgIC5yZXBsYWNlKC8oXFwuZGV2KT9cXC5wYXRjaCQvLCBcIlwiKVxuICAgIC5zcGxpdChcIisrXCIpXG4gICAgLm1hcChwYXJzZU5hbWVBbmRWZXJzaW9uKVxuICAgIC5maWx0ZXIoKHgpOiB4IGlzIE5vbk51bGxhYmxlPHR5cGVvZiB4PiA9PiB4ICE9PSBudWxsKVxuXG4gIGlmIChwYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgbGFzdFBhcnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXVxuXG4gIGlmICghbGFzdFBhcnQudmVyc2lvbikge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6IGxhc3RQYXJ0LnBhY2thZ2VOYW1lLFxuICAgIHZlcnNpb246IGxhc3RQYXJ0LnZlcnNpb24sXG4gICAgcGF0aDogam9pbihcbiAgICAgIFwibm9kZV9tb2R1bGVzXCIsXG4gICAgICBwYXJ0cy5tYXAoKHsgcGFja2FnZU5hbWU6IG5hbWUgfSkgPT4gbmFtZSkuam9pbihcIi9ub2RlX21vZHVsZXMvXCIpLFxuICAgICksXG4gICAgcGF0Y2hGaWxlbmFtZSxcbiAgICBwYXRoU3BlY2lmaWVyOiBwYXJ0cy5tYXAoKHsgcGFja2FnZU5hbWU6IG5hbWUgfSkgPT4gbmFtZSkuam9pbihcIi9cIiksXG4gICAgaHVtYW5SZWFkYWJsZVBhdGhTcGVjaWZpZXI6IHBhcnRzXG4gICAgICAubWFwKCh7IHBhY2thZ2VOYW1lOiBuYW1lIH0pID0+IG5hbWUpXG4gICAgICAuam9pbihcIiA9PiBcIiksXG4gICAgaXNOZXN0ZWQ6IHBhcnRzLmxlbmd0aCA+IDEsXG4gICAgcGFja2FnZU5hbWVzOiBwYXJ0cy5tYXAoKHsgcGFja2FnZU5hbWU6IG5hbWUgfSkgPT4gbmFtZSksXG4gICAgaXNEZXZPbmx5OiBwYXRjaEZpbGVuYW1lLmVuZHNXaXRoKFwiLmRldi5wYXRjaFwiKSxcbiAgICBzZXF1ZW5jZU5hbWU6IGxhc3RQYXJ0LnNlcXVlbmNlTmFtZSxcbiAgICBzZXF1ZW5jZU51bWJlcjogbGFzdFBhcnQuc2VxdWVuY2VOdW1iZXIsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGNoRGV0YWlsc0Zyb21DbGlTdHJpbmcoXG4gIHNwZWNpZmllcjogc3RyaW5nLFxuKTogUGFja2FnZURldGFpbHMgfCBudWxsIHtcbiAgY29uc3QgcGFydHMgPSBzcGVjaWZpZXIuc3BsaXQoXCIvXCIpXG5cbiAgY29uc3QgcGFja2FnZU5hbWVzID0gW11cblxuICBsZXQgc2NvcGU6IHN0cmluZyB8IG51bGwgPSBudWxsXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChwYXJ0c1tpXS5zdGFydHNXaXRoKFwiQFwiKSkge1xuICAgICAgaWYgKHNjb3BlKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgICBzY29wZSA9IHBhcnRzW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzY29wZSkge1xuICAgICAgICBwYWNrYWdlTmFtZXMucHVzaChgJHtzY29wZX0vJHtwYXJ0c1tpXX1gKVxuICAgICAgICBzY29wZSA9IG51bGxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhY2thZ2VOYW1lcy5wdXNoKHBhcnRzW2ldKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBhdGggPSBqb2luKFwibm9kZV9tb2R1bGVzXCIsIHBhY2thZ2VOYW1lcy5qb2luKFwiL25vZGVfbW9kdWxlcy9cIikpXG5cbiAgcmV0dXJuIHtcbiAgICBwYWNrYWdlTmFtZXMsXG4gICAgcGF0aCxcbiAgICBuYW1lOiBwYWNrYWdlTmFtZXNbcGFja2FnZU5hbWVzLmxlbmd0aCAtIDFdLFxuICAgIGh1bWFuUmVhZGFibGVQYXRoU3BlY2lmaWVyOiBwYWNrYWdlTmFtZXMuam9pbihcIiA9PiBcIiksXG4gICAgaXNOZXN0ZWQ6IHBhY2thZ2VOYW1lcy5sZW5ndGggPiAxLFxuICAgIHBhdGhTcGVjaWZpZXI6IHNwZWNpZmllcixcbiAgfVxufVxuIl19