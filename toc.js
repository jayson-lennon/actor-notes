// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="ddd.html"><strong aria-hidden="true">1.</strong> Quick DDD Primer</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="actor_systems.html"><strong aria-hidden="true">2.</strong> Actor Systems</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="actor_systems/what_is_an_actor_system.html"><strong aria-hidden="true">2.1.</strong> What is an Actor System?</a></li><li class="chapter-item expanded "><a href="actor_systems/why_choose_actor_model.html"><strong aria-hidden="true">2.2.</strong> Why Choose an Actor Model?</a></li><li class="chapter-item expanded "><a href="actor_systems/key_advantages_of_actors.html"><strong aria-hidden="true">2.3.</strong> Key Advantages of Actors</a></li><li class="chapter-item expanded "><a href="actor_systems/system_maintainability.html"><strong aria-hidden="true">2.4.</strong> System Maintainability</a></li></ol></li><li class="chapter-item expanded "><a href="actors.html"><strong aria-hidden="true">3.</strong> Actors</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="actors/message_passing.html"><strong aria-hidden="true">3.1.</strong> Message Passing</a></li><li class="chapter-item expanded "><a href="actors/mailboxes.html"><strong aria-hidden="true">3.2.</strong> Mailboxes</a></li><li class="chapter-item expanded "><a href="actors/communication_channels.html"><strong aria-hidden="true">3.3.</strong> Communication Channels</a></li></ol></li><li class="chapter-item expanded "><a href="system_design.html"><strong aria-hidden="true">4.</strong> System Design</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="system_design/supervision.html"><strong aria-hidden="true">4.1.</strong> Supervision</a></li><li class="chapter-item expanded "><a href="system_design/direct_actor_communication.html"><strong aria-hidden="true">4.2.</strong> Direct Actor Communication</a></li><li class="chapter-item expanded "><a href="system_design/pub_sub_communication.html"><strong aria-hidden="true">4.3.</strong> Pub/Sub Communication</a></li><li class="chapter-item expanded "><a href="system_design/hybrid_communication.html"><strong aria-hidden="true">4.4.</strong> Hybrid Communication</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="system_design/request_response.html"><strong aria-hidden="true">4.4.1.</strong> Request-Response</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="messaging_concepts.html"><strong aria-hidden="true">5.</strong> Messaging Concepts</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="messaging_concepts/correlation_ids.html"><strong aria-hidden="true">5.1.</strong> Correlation IDs</a></li><li class="chapter-item expanded "><a href="messaging_concepts/tell.html"><strong aria-hidden="true">5.2.</strong> Tell</a></li><li class="chapter-item expanded "><a href="messaging_concepts/ask.html"><strong aria-hidden="true">5.3.</strong> Ask</a></li><li class="chapter-item expanded "><a href="messaging_concepts/kinds_of_messages.html"><strong aria-hidden="true">5.4.</strong> Kinds of Messages</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.5.</strong> Dead Letters</div></li></ol></li><li class="chapter-item expanded "><a href="persistance.html"><strong aria-hidden="true">6.</strong> Persistance</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="persistence/journal.html"><strong aria-hidden="true">6.1.</strong> Journal</a></li><li class="chapter-item expanded "><a href="persistence/snapshots.html"><strong aria-hidden="true">6.2.</strong> Snapshots</a></li><li class="chapter-item expanded "><a href="persistence/actor_recovery.html"><strong aria-hidden="true">6.3.</strong> Actor Recovery</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">7.</strong> Testing</div></li><li class="chapter-item expanded "><a href="design_patterns.html"><strong aria-hidden="true">8.</strong> Design Patterns</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="design_patterns/resilience.html"><strong aria-hidden="true">8.1.</strong> Resilience</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="design_patterns/resilience/circuit_breaker.html"><strong aria-hidden="true">8.1.1.</strong> Circuit Breaker</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.1.2.</strong> Backoff</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.1.3.</strong> Retry</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.1.4.</strong> Throttling</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.1.5.</strong> Timeout</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.1.6.</strong> Fail Fast</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/isolation.html"><strong aria-hidden="true">8.2.</strong> Isolation and Resource Protection</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.2.1.</strong> Bulkhead</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.2.2.</strong> Load shedding</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.2.3.</strong> Rate Limiting</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.2.4.</strong> Mailbox Control</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/message_routing.html"><strong aria-hidden="true">8.3.</strong> Message Routing and Delivery</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.3.1.</strong> Dead Letter Queue</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.3.2.</strong> Scatter-Gather</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.3.3.</strong> Sharding</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.3.4.</strong> Consistent Hashing</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/state_and_lifecyle.html"><strong aria-hidden="true">8.4.</strong> State and Lifecycle Management</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.4.1.</strong> Passivation</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.4.2.</strong> Event Sourcing</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.4.3.</strong> State Machines</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.4.4.</strong> Lifecycle Hooks</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/coordination_and_workflow.html"><strong aria-hidden="true">8.5.</strong> Coordination and Workflow</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.5.1.</strong> Workflow Coordinator</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.5.2.</strong> Saga</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.5.3.</strong> FSM</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.5.4.</strong> Stashing</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.5.5.</strong> Aggregator</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/distribution.html"><strong aria-hidden="true">8.6.</strong> Distribution and Scalability</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.6.1.</strong> Cluster Singleton</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.6.2.</strong> Cluster Sharding</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.6.3.</strong> Replication</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.6.4.</strong> Partitioning</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.6.5.</strong> Service Discovery</div></li></ol></li><li class="chapter-item expanded "><a href="design_patterns/observability.html"><strong aria-hidden="true">8.7.</strong> Monitoring and Observability</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">8.7.1.</strong> Health Probes</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.7.2.</strong> Actor Logging</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.7.3.</strong> Dead Letter Monitoring</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.7.4.</strong> Circuit State Reporting</div></li></ol></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
