/* #Buildwithvinit - edit the STEPS array to customize content. */
const STEPS = [
{ t:"Open the AWS Console and select a Region", s:"Enter the cloud city",
 plain:"Ravi walks into the cloud city (AWS) and picks the district (Region) where his rented computer will live. Closer districts feel faster.",
 tech:"Sign in at console.aws.amazon.com. EC2 resources are Region-scoped: an instance in Mumbai (ap-south-1) is invisible in N. Virginia (us-east-1). Pick a Region near you and stay in it for the whole tutorial.",
 act:["Sign in to the AWS Management Console.","Use the Region selector in the top-right corner.","Choose a Region, for example Asia Pacific (Mumbai) ap-south-1.","Search for EC2 in the top search bar."],
 cmd:"# Console only for this step. Optional CLI check:\naws configure get region",
 watch:"The AWS cloud lights up. Nothing is rented yet.", story:"Ravi enters the cloud city and picks a district.",
 hl:["cloud"], pk:[], term:["$ (no computer yet)"] },
{ t:"Go to EC2, Instances, Launch instances", s:"Find the rental desk",
 plain:"EC2 is the rental desk for computers. Ravi clicks the button to rent a new one.",
 tech:"EC2 (Elastic Compute Cloud) provides virtual servers called instances. The launch wizard collects name, image, size, key, network and storage in one page.",
 act:["Open EC2 from the search bar.","Left menu: Instances → Instances.","Click the orange Launch instances button."],
 cmd:"# Console only. CLI equivalent comes later:\naws ec2 describe-instances --query \"Reservations[].Instances[].InstanceId\"",
 watch:"The AWS cloud and the empty VPC area glow: your future computer needs a place.", story:"Ravi walks up to the rental desk.",
 hl:["cloud","vpc"], pk:[], term:["$ (waiting to be launched)"] },
{ t:"Name the instance and choose Amazon Linux 2023", s:"Pick the operating system",
 plain:"Ravi labels his computer and chooses its operating system, Amazon Linux 2023, the one AWS builds and supports.",
 tech:"The name becomes a Name tag. The AMI (Amazon Machine Image) is the template for the root disk. Amazon Linux 2023 (AL2023) ships with SSH, EC2 Instance Connect, the AWS CLI and the default user ec2-user.",
 act:["Name: ravi-first-server.","Application and OS Images: choose Amazon Linux.","AMI: Amazon Linux 2023 AMI, Free tier eligible, 64-bit (x86 or Arm)."],
 cmd:"# Find the latest AL2023 AMI ID (optional):\naws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text",
 watch:"The EC2 box, the computer, appears and shows its Linux terminal.", story:"Ravi names his computer and picks Amazon Linux.",
 hl:["ec2"], pk:[], term:["$ AMI: Amazon Linux 2023","$ user: ec2-user"] },
{ t:"Choose instance type and storage", s:"Size and free tier",
 plain:"Ravi picks how strong the computer is and how big its disk is. A small one is enough to learn and may cost nothing.",
 tech:"t3.micro or t2.micro (Region dependent) is marked Free tier eligible. Newer AWS accounts get a credit-based Free Tier plan, older ones 750 hours a month for 12 months; check your Billing page because eligibility depends on account age and Region. Default root volume is gp3 8 GiB. Stop or terminate when done.",
 act:["Instance type: pick the one labelled Free tier eligible (for example t3.micro).","Configure storage: keep 8 GiB gp3.","Review the Free tier note shown in the Summary panel."],
 cmd:"# List free-tier eligible types in your Region:\naws ec2 describe-instance-types --filters Name=free-tier-eligible,Values=true --query \"InstanceTypes[].InstanceType\"",
 watch:"The EC2 box pulses: CPU, memory and disk are being chosen.", story:"Ravi picks a small, free-tier-friendly computer.",
 hl:["ec2"], pk:[], term:["$ type: t3.micro","$ disk: 8 GiB gp3"] },
{ t:"Key pair: create one, or proceed without", s:"The digital key",
 plain:"A key pair is a digital key. Ravi can cut a key and keep it safe (for his own terminal), or skip it and use the browser access desk instead.",
 tech:"Option A, with key pair: create RSA or ED25519, format .pem (OpenSSH) or .ppk (PuTTY). AWS stores the public key; you download the private key once. Option B, Proceed without a key pair (Not recommended): allowed, and you can still connect with EC2 Instance Connect in the browser, which pushes a temporary public key. Without a key you cannot SSH from your own terminal later.",
 act:["Key pair (login): click Create new key pair.","Name: my-key, type RSA, format .pem (use .ppk for PuTTY).","Save the downloaded my-key.pem somewhere safe. It cannot be downloaded again.","Or choose Proceed without a key pair for browser-only access."],
 cmd:"# Create a key from the CLI instead:\naws ec2 create-key-pair --key-name my-key --query KeyMaterial --output text > my-key.pem",
 watch:"A purple credential packet leaves the key box toward the gateway: the key will be shown at the door later.", story:"Ravi cuts a digital key, or decides to use the browser desk.",
 hl:["key","browser"], pk:["K"], term:["$ key: my-key.pem","$ or: no key pair"] },
{ t:"Network: VPC, public subnet, public IP, security group", s:"Address, road and door guard",
 plain:"Ravi puts the computer on a road that leads to the internet, gives it a public address, and hires a door guard who only opens the staff entrance (port 22).",
 tech:"Use a VPC whose subnet has a route 0.0.0.0/0 to an Internet Gateway (a public subnet). Enable Auto-assign public IPv4 address. Security group inbound rule: SSH, TCP 22, source = My IP (best) or the EC2 Instance Connect range for your Region. Never leave 0.0.0.0/0 on port 22 for real servers.",
 act:["Network settings → Edit.","VPC: default VPC is fine for learning.","Subnet: pick a public subnet; Auto-assign public IP: Enable.","Firewall: Create security group, rule SSH, port 22, Source type My IP."],
 cmd:"# Check that your subnet is public:\naws ec2 describe-route-tables --query \"RouteTables[].Routes[?GatewayId!=null]\"",
 watch:"The gateway, VPC, subnet and security group light up. A red packet is stopped at door 22 when the guard refuses it.", story:"Ravi sets the road, the address and the door guard.",
 hl:["igw","vpc","sub","sg","door"], pk:["X"], term:["$ public IPv4: enabled","$ SG: tcp/22 from My IP"] },
{ t:"Launch, wait for Running and status checks", s:"The computer wakes up",
 plain:"Ravi presses Launch. The computer switches on. He waits for green lights before knocking.",
 tech:"Instance state goes pending, then running. Status checks take 1 to 3 minutes: System status (AWS hardware) and Instance status (OS reachable) should show 2/2 checks passed. Note the Public IPv4 address from the Details tab.",
 act:["Review the Summary, then click Launch instance.","Click View all instances.","Wait for Instance state: Running and Status check: 2/2 checks passed.","Select the instance and copy the Public IPv4 address."],
 cmd:"aws ec2 wait instance-status-ok --instance-ids i-0123456789abcdef0\naws ec2 describe-instances --instance-ids i-0123456789abcdef0 --query \"Reservations[].Instances[].PublicIpAddress\"",
 watch:"A green pulse beats on the EC2 box: the instance is alive.", story:"The computer is on. Time to knock.",
 hl:["ec2","sg"], pk:[], term:["$ state: running","$ checks: 2/2 passed"] },
{ t:"Connect without a key pair: EC2 Instance Connect", s:"Browser access desk",
 plain:"Ravi walks to the browser access desk. AWS sends a one-time key to the computer for him, and a control room opens right in the browser.",
 tech:"EC2 Instance Connect pushes a temporary public key (valid 60 seconds) and opens a browser SSH session to ec2-user. Requirements: instance Running with a public IPv4; security group allows TCP 22 from the Instance Connect IP range of your Region; IAM permission ec2-instance-connect:SendSSHPublicKey; AL2023 (EC2 Instance Connect preinstalled). No public IP? Use an EC2 Instance Connect Endpoint.",
 act:["EC2 → Instances → select the instance → Connect.","Tab: EC2 Instance Connect.","Connection type: Connect using a Public IP.","Username: ec2-user, then click Connect."],
 cmd:"# Browser needs no command. CLI version:\naws ec2-instance-connect ssh --instance-id i-0123456789abcdef0 --os-user ec2-user",
 watch:"Gold request flows from the browser, a purple temporary key follows, green acceptance returns.", story:"The browser desk opens the staff entrance for Ravi.",
 hl:["browser","igw","sg","door","ec2"], pk:["B","C","G"], term:["Last login: just now","[ec2-user@ip ~]$ _"] },
{ t:"Connect with a key pair: CMD, PowerShell, Git Bash, MobaXterm, PuTTY", s:"Own terminal and digital key",
 plain:"Ravi uses his own control room (terminal) and shows his digital key to the door guard. If the key fits, he is let in as ec2-user.",
 tech:"Windows 10/11 include the OpenSSH client (CMD, PowerShell). Git Bash also ships ssh. Private key permissions must be locked to you. PuTTY cannot read .pem: convert to .ppk with PuTTYgen, then set Host ec2-user@PUBLIC-IP and Connection → SSH → Auth → Credentials → private key. MobaXterm: Session → SSH, Remote host = public IP, tick Specify username = ec2-user, Advanced SSH settings → Use private key.",
 act:["Copy the Public IPv4 from the instance details.","Open CMD, PowerShell or Git Bash in the folder with my-key.pem.","Fix key permissions, then run the ssh command.","Type yes at the host fingerprint prompt the first time."],
 cmd:"ssh -i my-key.pem ec2-user@PUBLIC-IP\n\n# Windows key permissions (CMD/PowerShell):\nicacls my-key.pem /inheritance:r\nicacls my-key.pem /grant:r \"%USERNAME%\":R\n\n# Git Bash, Linux, macOS:\nchmod 400 my-key.pem",
 watch:"Gold SSH packet and purple key packet cross the gateway and the door; green acceptance returns to the terminal.", story:"Ravi shows his key at the staff entrance.",
 hl:["term","key","igw","sg","door","ec2"], pk:["T","K","G"], term:["Warning: added host key","[ec2-user@ip ~]$ _"] },
{ t:"Verify the connection and fix problems", s:"Check and troubleshoot",
 plain:"Ravi asks the computer who he is and where he is. If the door stays shut, he checks the guard, the road, the address and the key.",
 tech:"Timeout: security group lacks port 22 from your IP, or no public IP, or the subnet route table has no 0.0.0.0/0 to the Internet Gateway (also check network ACLs). Permission denied (publickey): wrong username (use ec2-user on AL2023), wrong .pem, or key permissions too open (UNPROTECTED PRIVATE KEY FILE). No public IP: enable auto-assign or attach an Elastic IP. Wrong security group: confirm it is attached to the instance. Host changed warning: stop/start gave a new IP; remove the old known_hosts entry.",
 act:["Run the five checks below inside the session.","Timeout? Check security group, public IP and route table.","Permission denied? Check username ec2-user and the key file.","When finished, stop or terminate the instance to avoid charges."],
 cmd:"whoami          # ec2-user\nhostname        # ip-172-31-x-x.ap-south-1.compute.internal\npwd             # /home/ec2-user\ncat /etc/os-release   # Amazon Linux 2023\nip addr         # shows the private IP\n\n# Debug from your laptop:\nssh -v -i my-key.pem ec2-user@PUBLIC-IP",
 watch:"Green means success; the red packet shows what a refused connection looks like at door 22.", story:"Ravi confirms he is inside, and knows how to fix a shut door.",
 hl:["term","sg","door","ec2"], pk:["T","G","X"], term:["$ whoami","ec2-user","$ pwd","/home/ec2-user"] }
];

if (typeof module !== "undefined") { module.exports = STEPS; }
else {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = 0, timer = null;
  const list = $("steps");
  STEPS.forEach((st, i) => {
    const li = document.createElement("li"), b = document.createElement("button");
    b.innerHTML = "<b>" + (i + 1) + "</b><span>" + st.t + "<small>" + st.s + "</small></span>";
    b.onclick = () => go(i); li.appendChild(b); list.appendChild(li);
  });
  const svg = $("svg");
  function go(i) {
    cur = (i + STEPS.length) % STEPS.length; const st = STEPS[cur];
    [...list.querySelectorAll("button")].forEach((b, k) => k === cur ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current"));
    svg.querySelectorAll(".box").forEach(g => g.classList.toggle("on", st.hl.includes(g.id.slice(2))));
    svg.querySelectorAll(".pk").forEach(g => g.classList.toggle("on", !reduce && st.pk.includes(g.id.slice(2))));
    $("pulse").style.display = cur === 6 ? "inline" : "none";
    ["t1","t2","t3","t4"].forEach((id, k) => $(id).textContent = st.term[k] || "");
    $("story").textContent = "Story: " + st.story;
    $("p-title").textContent = (cur + 1) + ". " + st.t;
    $("p-plain").textContent = st.plain; $("p-tech").textContent = st.tech;
    $("p-act").innerHTML = ""; st.act.forEach(a => { const l = document.createElement("li"); l.textContent = a; $("p-act").appendChild(l); });
    $("p-cmd").textContent = st.cmd; $("p-watch").textContent = st.watch;
    if (svg.setCurrentTime) svg.setCurrentTime(0);
  }
  function play(on) {
    clearInterval(timer); $("play").setAttribute("aria-pressed", on);
    if (on) timer = setInterval(() => go(cur + 1), 5000);
  }
  $("next").onclick = () => go(cur + 1); $("prev").onclick = () => go(cur - 1);
  $("play").onclick = () => play($("play").getAttribute("aria-pressed") !== "true");
  $("reset").onclick = () => { play(false); go(0); };
  $("theme").onclick = () => {
    const d = document.documentElement, dark = getComputedStyle(d).getPropertyValue("--bg").trim() === "#070d22";
    d.dataset.theme = dark ? "light" : "dark"; $("theme").setAttribute("aria-pressed", !dark);
  };
  if (reduce && svg.pauseAnimations) svg.pauseAnimations();
  go(0);
}
