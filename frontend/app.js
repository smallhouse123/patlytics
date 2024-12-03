var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
var _this = this;
// Function to send a POST request to the backend
function checkInfringement(data) {
    return __awaiter(this, void 0, void 0, function () {
        var response, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://127.0.0.1:8000/check", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorMessage = _a.sent();
                    throw new Error("Error: ".concat(response.status, " - ").concat(errorMessage));
                case 3: return [2 /*return*/, response.json()];
            }
        });
    });
}
// Handle form submission
(_a = document.getElementById("infringementForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (event) { return __awaiter(_this, void 0, void 0, function () {
    var patentId, companyName, resultsDiv, requestData, response, productsHTML, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                patentId = document.getElementById("patentId").value;
                companyName = document.getElementById("companyName").value;
                resultsDiv = document.getElementById("results");
                resultsDiv.innerHTML = "Checking infringement...";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                requestData = {
                    publication_number: patentId,
                    company_name: companyName,
                };
                return [4 /*yield*/, checkInfringement(requestData)];
            case 2:
                response = _a.sent();
                if (response.infringing_products.length > 0) {
                    productsHTML = response.infringing_products
                        .map(function (product) {
                        return "<div>\n              <strong>Product Name:</strong> ".concat(product.name, "<br/>\n              <strong>Claim:</strong> ").concat(product.claim, "<br/>\n              <strong>Reason:</strong> ").concat(product.reason, "\n            </div><hr/>");
                    })
                        .join("");
                    resultsDiv.innerHTML = "<h3>Potential Infringing Products:</h3>".concat(productsHTML);
                }
                else {
                    resultsDiv.innerHTML = "<h3>No infringement detected.</h3>";
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                resultsDiv.innerHTML = "<p style=\"color: red;\">".concat(error_1, "</p>");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
