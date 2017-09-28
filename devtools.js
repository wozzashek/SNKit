function getTabId() {
  return chrome.devtools.inspectedWindow.tabId;
}

var widgetUtil = (() => {
  return {
    getWidgetProperties: () => {
      var widgetScopes = []; 
      var spWidgets = document.querySelectorAll("[widget='widget']");

      // create Widget class
      class Widget {
        constructor(name, scope) {
          this.name = name;
          this.scope = scope;
        }
      }
      for(var i = 0; i < spWidgets.length; i++){
        var thisScope = angular.element(spWidgets[i]).scope();
        var scopeCopy = {};
        for(var property in thisScope) {
          if(property.charAt(0) !== "$" || property === "$root") {
              scopeCopy[property] = thisScope[property];
          }
        }
        var thisWidget = new Widget(scopeCopy.widget.name, scopeCopy);
        widgetScopes.push(thisWidget);
      };
      widgetScopes.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        let comparison = 0;
        if(nameA > nameB){
          comparison = 1;
        } else if(nameA < nameB){
          comparison = -1;
        }
        return comparison;
      });
      return widgetScopes;
    },
    getWidgetDetails: (fieldName, mandatory) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "getWidgetDetails", cmdType: "page", data: {} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "getWidgetDetails"){
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    inspectWidget: (widgetIdentityObj) => {
      if(widgetIdentityObj.identifier == "id") 
        var inspectScript = `inspect(document.getElementById("${widgetIdentityObj.idNum}"))`
      else
        var inspectScript = `inspect(document.querySelector(".${widgetIdentityObj.idNum}"))`
      chrome.devtools.inspectedWindow.eval(inspectScript, {}, function (result, exceptionInfo) {
        console.log(result);
      });
    },
    highlightWidget: (widgetIdentityObj) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      port.postMessage({ tabId: getTabId(), text: "highlightWidget", cmdType: "content_script", 
        data: {idNum: widgetIdentityObj.idNum, identifier: widgetIdentityObj.identifier} });
      port.onMessage.addListener((data) => {
        if(data.type == "EVENT_PAGE" && data.cmd == "highlightWidget"){
          port.disconnect();
        }
      });
    },
    removeWidgetHighlight: (widgetIdentityObj) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      port.postMessage({ tabId: getTabId(), text: "removeWidgetHighlight", cmdType: "content_script", 
        data: {idNum: widgetIdentityObj.idNum, identifier: widgetIdentityObj.identifier} });
      port.onMessage.addListener((data) => {
        if(data.type == "EVENT_PAGE" && data.cmd == "removeWidgetHighlight"){
          port.disconnect();
        }
      });
    },
    debugController: (widgetIdentityObj) => {
      // construct the script name and open the resource
      var scriptName = "";
      if (widgetIdentityObj.techname) {
        scriptName = widgetIdentityObj.techname + ".js";
      } else {
        scriptName = widgetIdentityObj.idNum + ".js";
      }
      chrome.devtools.panels.openResource(scriptName); 
    }
  }
})();

function createNewIssue(){
  // Create a port for communication with the event page
  var port = chrome.runtime.connect({ name: "devtools-page" });
  port.postMessage({ tabId: "", text: "createNewIssue", cmdType: "event_page", data: {} });
}

var formUtil = (() => {
  return {
    getFieldProperties: () => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({name: "devtools-page"});
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "getFormProperties", cmdType: "page", data: {} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "getFormProperties"){
            console.log("getFormProperties port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    clearValue: (fieldName) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "clearValue", cmdType: "page", data: {fieldName: fieldName} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "clearValue"){
            console.log("clearValue port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    enableDisableField: (fieldName, disable) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "enableDisableField", cmdType: "page", 
          data: {fieldName: fieldName, disable: disable} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "enableDisableField"){
            console.log("enableDisableField port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    setRemoveMandatory: (fieldName, mandatory) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "setRemoveMandatory", cmdType: "page", 
          data: {fieldName: fieldName, mandatory: mandatory} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "setRemoveMandatory"){
            console.log("setRemoveMandatory port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    showHideField: (fieldName, show) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({ name: "devtools-page" });
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "showHideField", cmdType: "page", 
          data: {fieldName: fieldName, show: show} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "showHideField"){
            console.log("showHideField port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    showAllHiddenFields: () => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({name: "devtools-page"});
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "showAllHiddenFields", cmdType: "page", data: {} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "showAllHiddenFields"){
            console.log("showAllHiddenFields port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    showReference: (fieldName) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({name: "devtools-page"});
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "showReference", cmdType: "page", data: {fieldName: fieldName} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "showReference"){
            console.log("showReference port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    showUiPolicies: (fieldName) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({name: "devtools-page"});
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "showUiPolicies", cmdType: "page", data: {fieldName: fieldName} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "showUiPolicies"){
            console.log("showUiPolicies port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    },
    showClientScripts: (fieldName) => {
      // Create a port for communication with the event page
      var port = chrome.runtime.connect({name: "devtools-page"});
      return new Promise((resolve, reject) => {
        port.postMessage({ tabId: getTabId(), text: "showClientScripts", cmdType: "page", data: {fieldName: fieldName} });
        port.onMessage.addListener((data) => {
          if(data.type == "EVENT_PAGE" && data.cmd == "showClientScripts"){
            console.log("showClientScripts port.disconnect()");
            port.disconnect();
            if(data.content) resolve(data.content);
            else reject();
          }
        });
      });
    }
  }
})();

var sidebarUtil = (() => {
  var _widgetSidebar;
  var _formSidebar;
  return {
    renderWidgetSidebarPanel: () => {
      // Create the new sidepanel for the elements pane
      chrome.devtools.panels.elements.createSidebarPane(
        "Service Portal Widget Scopes",
        (sidebar) => {
          _widgetSidebar = sidebar;
          sidebar.setExpression("(" + widgetUtil.getWidgetProperties.toString() + ")()", "Service Portal Widgets");
      });
    },
    renderFormSidebarPanel: () => {
      formUtil.getFieldProperties().then((data) => {
        if (data.fieldDetails) {
          chrome.devtools.panels.elements.createSidebarPane(
            "ServiceNow Form Fields",
            (sidebar) => {
              sidebar.setObject(data.fieldDetails, "ServiceNow Form Fields");
          });
        }
        if (data.variableDetails) {
          chrome.devtools.panels.elements.createSidebarPane(
            "ServiceNow Form Variables",
            (sidebar) => {
              sidebar.setObject(data.variableDetails, "ServiceNow Form Variables");
          });
        }
      })
    },
    refreshSidebar: () => {
      _widgetSidebar.setExpression("(" + widgetUtil.getWidgetProperties.toString() + ")()", "Service Portal Widgets");
    }
  }
})();

// Create the initial sidebarPanels
sidebarUtil.renderWidgetSidebarPanel();
sidebarUtil.renderFormSidebarPanel();

chrome.devtools.panels.create("SNKit", "", "snkit.html",
  (spPanel) => {
    // The JavaScript window object of the panel's page can be
    // sourced using the onShown.addListener event
    var show = new Promise((resolve, reject) => {
      spPanel.onShown.addListener((spPanelWindow) => {
        resolve(spPanelWindow);
      });
    });

    show.then((_spPanelWindow) => {
      function renderFieldsAnalysis(data) {
        var fieldHTML = "";
        var targetEl = _spPanelWindow.document.getElementById("fieldsList");

        data.forEach(function (obj) {
          fieldHTML += `
            <div class='col-md-12'>
            <div class='panel panel-default fields' id=${obj.fieldName}>
            <div class='panel-body propertyKey'>
            <p>Field name: <span class='propertyValue'>${obj.fieldName}</span></p>
            <p>Current value: <span class='propertyValue'>${obj.currentValue}</span></p>`
          if(obj.displayValue)
            fieldHTML +=`<p>Display value: <span class='propertyValue'>${obj.displayValue}</span></p>`
          fieldHTML +=`
            <p>Type: <span class='propertyValue'>${obj.type}</span></p>
            <p>Reference: <span class='propertyValue'>${obj.reference}</span></p>
            <p>Table name: <span class='propertyValue'>${obj.tableName}</span></p>
            <p>Mandatory: <span class='propertyValue'>${obj.mandatory}</span></p>
            <p>Scope: <span class='propertyValue'>${obj.scope}</span></p>            
            </div></div></div>`
        });
        targetEl.innerHTML = fieldHTML;
      }
      function renderVariablesAnalysis(data) {
        var variableHTML = "";
        var targetEl = _spPanelWindow.document.getElementById("variablesList");

        data.forEach(function (obj) {
          variableHTML += `
            <div class='col-md-12'>
            <div class='panel panel-default fields' id=${obj.fieldName}>
            <div class='panel-body propertyKey'>
            <p>Name: <span class='propertyValue'>${obj.Name}</span></p>
            <p>Field name: <span class='propertyValue'>${obj.fieldName}</span></p>
            <p>Current value: <span class='propertyValue'>${obj.currentValue}</span></p>`
          if(obj.displayValue)
            variableHTML +=`<p>Display value: <span class='propertyValue'>${obj.displayValue}</span></p>`
          variableHTML += `
            <p>Type: <span class='propertyValue'>${obj.type}</span></p>
            <p>Reference: <span class='propertyValue'>${obj.reference}</span></p>
            <p>Table name: <span class='propertyValue'>${obj.tableName}</span></p>
            <p>Mandatory: <span class='propertyValue'>${obj.mandatory}</span></p>
            <p>Scope: <span class='propertyValue'>${obj.scope}</span></p>
            </div></div></div>`
        });
        targetEl.innerHTML = variableHTML;
      }
      function makeFieldsSelectable() {
        var fieldsArray = _spPanelWindow.document.querySelectorAll(".fields");
        fieldsArray.forEach((field) => {
          field.addEventListener("click", (event) => {
            var el = event.target;
            while (el && el.parentNode) {
              /**
               * Traverse up to the panel element.
               * If the panel is already selected then remove the selectedField class.
               * If this is a newly selected panel, mark the panel as selected and flag it
               * so that it does not get removed when the previous selected panel is cleared.
               */
              if (el.classList.contains("panel-default")) {
                if (el.classList.contains("selectedField")) {
                  el.classList.remove("selectedField");
                  break;
                } else {
                  el.classList.add("selectedField");
                  el.classList.add("remainSelected");
                  break;
                }
              }
              el = el.parentNode;
            }
            var selectedFieldsArray = _spPanelWindow.document.querySelectorAll(".selectedField");
            if(selectedFieldsArray.length > 0){
              selectedFieldsArray.forEach((field) => {
                if (field.classList.contains("selectedField") && field.classList.contains("remainSelected")) {
                  field.classList.remove("remainSelected");
                } else {
                  field.classList.remove("selectedField");
                }
              });
            }
          }, false);
        });
      }

      formUtil.getFieldProperties().then((data) => {
        if(data.fieldDetails)
          renderFieldsAnalysis(data.fieldDetails);
        if(data.variableDetails)
          renderVariablesAnalysis(data.variableDetails);
      }).then(() => { makeFieldsSelectable() });

      function getSelectedFieldName() {
        return _spPanelWindow.document.querySelector(".selectedField").id;
      }

      function applyWidgetListeners() {
        var widgetBoxArray = _spPanelWindow.document.querySelectorAll(".widgetBox");
        widgetBoxArray.forEach((widgetBox) => {
          widgetBox.addEventListener("click", (event) => {
            var el = event.target;
            while (el && el.parentNode) {
              if (el.classList.contains("widgetBox")) {
                //check if inspect mode is enabled to choose the right function
                if(_spPanelWindow.document.getElementById("inspectMode").checked){
                  widgetUtil.inspectWidget({idNum: el.classList.item(1), identifier: el.dataset.identifier});
                } else {
                  widgetUtil.debugController({idNum: el.classList.item(1), techname: el.dataset.techname});
                }
                break;
              }
              el = el.parentNode;
            }
          })
          widgetBox.addEventListener("mouseover", (event) => {
            var el = event.target;
            while (el && el.parentNode) {
              if (el.classList.contains("widgetBox")) {
                widgetUtil.highlightWidget({idNum: el.classList.item(1), identifier: el.dataset.identifier});
                break;
              }
              el = el.parentNode;
            }
          })
          widgetBox.addEventListener("mouseout", (event) => {
            var el = event.target;
            while (el && el.parentNode) {
              if (el.classList.contains("widgetBox")) {
                widgetUtil.removeWidgetHighlight({idNum: el.classList.item(1), identifier: el.dataset.identifier});
                break;
              }
              el = el.parentNode;
            }
          })
        })
      }

      function renderServicePortalTab(){
        widgetUtil.getWidgetDetails().then((widgets) => {
        var widgetHTML = "";
        var targetEl = _spPanelWindow.document.getElementById("widgetsList");

        widgets.forEach((obj, i) => {
          if(i == 0){
            widgetHTML += `
              <div class="row">
                <div class="col-md-6 widgetList">
                  <div class="widgetBox ${obj.id ? obj.id : obj.className}" 
                      data-identifier="${obj.identifier}" data-techname="${obj.technicalName}">
                    <em>${obj.name}</em>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" id="inspectMode">
                    Inspect mode
                  </label>
                </div>
              </div>`
          } else {
            widgetHTML += `
            <div class="row">
              <div class="col-md-6 widgetList">
                <div class="widgetBox ${obj.id ? obj.id : obj.className}" 
                    data-identifier="${obj.identifier}" data-techname="${obj.technicalName}">
                  <em>${obj.name}</em>
                </div>
              </div>
              <div class="col-md-6"></div>
            </div>`
          }
        });
        targetEl.innerHTML = widgetHTML;
        applyWidgetListeners();
        });
      }

      function renderUiPolicies(selectedFieldName, policies){
        var uiPoliciesTab = _spPanelWindow.document.getElementById("uiPoliciesSelector");
        uiPoliciesTab.style.display = "block";
        console.log(policies)

        var targetEl = _spPanelWindow.document.getElementById("policiesList");
        var policiesHTML = `<h3><strong><em>UI Policies that apply to field <span style="color: green">${selectedFieldName}</span></em></strong></h3>`;
        policies.forEach((policy) => {
          policiesHTML += 
            `<div class='panel panel-default'>
              <div class='panel-body'>
                <p>"${policy.name}"</p>
                <p><a>${policy.url}</a></p>
              </div>
            </div>`
        });
        targetEl.innerHTML = policiesHTML;
      }

      function renderClientScripts(selectedFieldName, clientScripts){
        var clientScriptsTab = _spPanelWindow.document.getElementById("clientScriptsSelector");
        clientScriptsTab.style.display = "block";
        console.log(clientScripts)

        var targetEl = _spPanelWindow.document.getElementById("clientScriptsList");
        var clientScriptsHTML = `<h3><strong><em>Client Scripts that refer to field <span style="color: green">${selectedFieldName}</span></em></strong></h3>`;
        clientScripts.forEach((clientScript) => {
          clientScriptsHTML += 
            `<div class='panel panel-default'>
              <div class='panel-body'>
                <p>"${clientScript.name}"</p>
                <p>"${clientScript.type}"</p>
                <p><a>${clientScript.url}</a></p>
              </div>
            </div>`
        });
        targetEl.innerHTML = clientScriptsHTML;
      }

      /**
       * Bootstrap tab changes are difficult to react to without JQuery,
       * so the MutationObserver class will be used instead of addEventListener.
       */
      var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          //Once the Service Portal tab becomes active, take action
          if(mutation.target.className == "tab-pane active")
            renderServicePortalTab();
        });
      });

      var observerConfig = {
        attributes: true,
        childList: false,
        characterData: false,
        attributeOldValue: true
      };

      var targetNode = _spPanelWindow.document.getElementById("servicePortalTab");
      observer.observe(targetNode, observerConfig);

      // add event listeners to the clearValue button
      var clearValueBtn = _spPanelWindow.document.getElementById("clearValueBtn");
      clearValueBtn.addEventListener("click", () => {
        formUtil.clearValue(getSelectedFieldName());
      }, false);

      // add event listeners to the disable field button
      var disableFieldBtn = _spPanelWindow.document.getElementById("disableFieldBtn");
      disableFieldBtn.addEventListener("click", () => {
        formUtil.enableDisableField(getSelectedFieldName(), true);
      }, false);

      // add event listeners to the enable field button
      var enableFieldBtn = _spPanelWindow.document.getElementById("enableFieldBtn");
      enableFieldBtn.addEventListener("click", () => {
        formUtil.enableDisableField(getSelectedFieldName(), false);
      }, false);

      // add event listeners to the set mandatory button
      var setMandatoryBtn = _spPanelWindow.document.getElementById("setMandatoryBtn");
      setMandatoryBtn.addEventListener("click", () => {
        formUtil.setRemoveMandatory(getSelectedFieldName(), true);
      }, false);

      // add event listeners to the remove mandatory button
      var removeMandatoryBtn = _spPanelWindow.document.getElementById("removeMandatoryBtn");
      removeMandatoryBtn.addEventListener("click", () => {
        formUtil.setRemoveMandatory(getSelectedFieldName(), false);
      }, false);

      // add event listeners to the show field button
      var showFieldBtn = _spPanelWindow.document.getElementById("showFieldBtn");
      showFieldBtn.addEventListener("click", () => {
        formUtil.showHideField(getSelectedFieldName(), true);
      }, false);

      // add event listeners to the hide field button
      var hideFieldBtn = _spPanelWindow.document.getElementById("hideFieldBtn");
      hideFieldBtn.addEventListener("click", () => {
        formUtil.showHideField(getSelectedFieldName(), false);
      }, false);

      // add event listeners to the hide field button
      var showAllHiddenFieldsBtn = _spPanelWindow.document.getElementById("showAllHiddenFieldsBtn");
      showAllHiddenFieldsBtn.addEventListener("click", () => {
        formUtil.showAllHiddenFields();
      }, false);

      // add event listeners to the hide field button
      var showReferenceBtn = _spPanelWindow.document.getElementById("showReferenceBtn");
      showReferenceBtn.addEventListener("click", () => {
        formUtil.showReference(getSelectedFieldName());
      }, false);

      // add event listeners to the search UI Policies button
      var showUiPoliciesBtn = _spPanelWindow.document.getElementById("showUiPoliciesBtn");
      showUiPoliciesBtn.addEventListener("click", () => {
        var selectedFieldName = getSelectedFieldName();
        formUtil.showUiPolicies(selectedFieldName).then((policies) => {renderUiPolicies(selectedFieldName, policies)});
      }, false);

      // add event listeners to the search UI Policies button
      var showClientScriptsBtn = _spPanelWindow.document.getElementById("showClientScriptsBtn");
      showClientScriptsBtn.addEventListener("click", () => {
        var selectedFieldName = getSelectedFieldName();
        formUtil.showClientScripts(selectedFieldName).then((clientScripts) => {renderClientScripts(selectedFieldName, clientScripts)});
      }, false);

      // add event listeners to the hide field button
      var createIssueBtn = _spPanelWindow.document.getElementById("createIssue");
      createIssueBtn.addEventListener("click", () => {
        createNewIssue();
      }, false);

    }).catch((e) => {
      console.log(e);
    });
});