---
title: ZeroTier因更新macOS发生残留导致断网的排查
description: 从问题莫名其妙发生，反复尝试、一点点排查定位，到抽丝剥茧、逐渐锁定问题，我是这样做的。
author: BG2FNV
date: 2025-12-28 19:55:00 +0800
categories: [macOS, 技术]
tags: [macOS, 技术]
image:
  path: /img/markdown/zerotier/cover.jpg
  lqip: data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/4QDKRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAAOgAwAEAAAAAQAAAAKkBgADAAAAAQAAAAAAAAAAAAD/wAARCAACAAMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwABAQEBAQECAQECAwICAgMEAwMDAwQFBAQEBAQFBgUFBQUFBQYGBgYGBgYGBwcHBwcHCAgICAgJCQkJCQkJCQkJ/9sAQwEBAQECAgIEAgIECQYFBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJ/90ABAAB/9oADAMBAAIRAxEAPwD8Lf8AgpR8ffjt4A/bQ8XeDfAnjXXtE0jT4dJitbGw1K6traBP7KtDtihikVEXJJwoAr4W/wCGrf2o/wDopXir/wAHF9/8er6O/wCCq3/J+njr/d0n/wBNNnX56V73Av8AyJMH/wBeqf8A6Qj5XjX/AJHOL/6+T/8ASmf/2Q==
  alt: ZeroTier Logo and Wi-Fi
---

> 如果代码能跑，就不要动它了。
>
> ——佚名

> 系统也是。
> 
> ——笔者

## 从非法博彩广告开始

我本来是不想更新到iOS 26和macOS Tahoe的，我不喜欢那个玻璃风格和新启动台。

平时常用iMessage和朋友聊天，所以我很注重信息界面的整洁。我有一个旧版本的熊猫吃短信[^xmcdx]（买断版），平时我使用它自动完成对新消息的归类，在过去的几年里，它一直良好运转，直到我收到了巨量来自赌博网站的骚扰短信。

iCloud可以将手机端的短信同步到电脑，但不知道从什么时候开始，苹果修改了第三方短信过滤器的接口。旧版本熊猫吃短信可以在手机上拦截骚扰短信并将其归类到“垃圾邮件”，但是因为macOS Sequoia上没有对应的拦截软件和接口，在Mac上，这些短信仍然会通知。

投诉无果，我只能选择更新系统，并且切换到另一个风评很好的骚扰拦截软件——[拦截猫](https://apps.apple.com/cn/app/拦截猫-垃圾短信电话拦截/id6476010032)。果然垃圾短信再也没有出现过。

## 问题初现

晚饭，这是我一天中最喜欢的环节。把外卖取回寝室，然后打开B站，看[苏别黎](https://space.bilibili.com/384080078)的游戏实况。

但是今天有些不太一样：新系统开始发力了，打开Safari，只显示一个巨大的“未连接互联网”。之前我就遇到过这种情况，可能是MacBook的网卡出了问题，只需要关闭一下Wi-Fi，再重新打开就好了。按照以往的经验，我重启了Wi-Fi，问题果然解决了。

然而没高兴几分钟，视频突然卡住了。我试着刷新页面，熟悉的“未连接互联网”再次出现。与此同时，微信也开始展示红条，提示我网络断开。我只能再次重启Wi-Fi，又好了。

当时我并没有太当回事，转而使用我的台式机继续观看。那几天我没有使用Mac，随后的一天，我去专教画图，拿着MacBook远程寝室的台式机，网络也非常平稳，没有中断，因此这个问题便被我逐渐淡忘了。

## 全面崩溃

就这样沉寂了几天，在一个下午，我再次打开我的MacBook，开始写期末大作业。

这次网络的中断终于达到了无法忍受的程度：重启Wi-Fi后，网络开始不定时断开，从几分钟一次到几秒钟一次。期间，Wi-Fi图标一直显示信号满格，没有任何奇怪的迹象，我的手机和Switch也都可以正常连接学校的热点。也就是说，我的Mac出现了问题。

我首先想到的就是Yosemite时期遗留的AWDL问题。AWDL是用于AirDrop、AirPlay的直连服务。虽然已经是多年前的漏洞，但是在苹果改用M系列芯片后，仍有报告在新系统里问题复现的案例。所以，我首先关闭了AirDrop和`awdl0`接口。

```shell
sudo ifconfig awdl0 down
```
我本想先用当年的[WiFriedX](https://github.com/mariociabarra/wifriedx)缓解，然后等待苹果更新修复，但我发现我的网络仍然会断开，并且`awdl0`并没有重启。

```shell
noblee.tung@MacBook-Pro ~ % ifconfig awdl0
awdl0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
       options=6460<TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
       ether fa:83:f8:be:c2:9e
       inet6 fe80::f883:f8ff:febe:c29e%awdl0 prefixlen 64 scopeid 0x10 
       nd6 options=201<PERFORMNUD,DAD>
       status: inactive
```

坏了，开始复杂起来了，这不是AWDL导致的，问题应该是比较深入，可能出现在一直以来我不愿意碰的物理层和路由层。

学校Wi-Fi对IPV6的支持一直很好，所以这部分出问题的可能性基本没有；认证页面能顺利登录，那么和ARP关系应该也不大；甚至活动监视器里面的mDNSResponder也好好的。所以我把目光锁定在**路由表**上。

为了让不太了解这一块的读者朋友们也能感受到这种抽丝剥茧的乐趣，在此我想我有必要进行一些这样的比喻和解释：路由表是网络设备中的一个数据库，**它指示网络中的数据包应该走向何处**，起到高德地图的作用。每一个网络设备都复杂得像个重庆——如果导航坏了，你还能找到正确的路吗？

```shell
noblee.tung@MacBook-Pro ~ % netstat -rn
Internet:
Destination        Gateway            Flags               Netif Expire
default            link#28            UCSg                utun8       
default            10.68.255.254      UGScIg                en0       
8.8.8.8            link#28            UHW3Ig              utun8     37
...
```

可以看到此时路由表上出现了两个`default`项，在最上层，`utun8`此时正接管着所有流量，排第二的才是代表Wi-Fi的`en0`。

不知道这是一个硬件端口还是软件的，所以我使用`networksetup -listallhardwareports`列出了所有的硬件端口。

```shell
noblee.tung@MacBook-Pro ~ % networksetup -listallhardwareports

Hardware Port: Ethernet Adapter (en4)
Device: en4
Ethernet Address: e6:53:fc:a2:fe:25

Hardware Port: Ethernet Adapter (en5)
Device: en5
Ethernet Address: e6:53:fc:a2:fe:26

Hardware Port: Ethernet Adapter (en6)
Device: en6
Ethernet Address: e6:53:fc:a2:fe:27

Hardware Port: Thunderbolt Bridge
Device: bridge0
Ethernet Address: 36:99:7d:82:3f:40

Hardware Port: Wi-Fi
Device: en0
Ethernet Address: bc:d0:74:30:0e:71

Hardware Port: Thunderbolt 1
Device: en1
Ethernet Address: 36:99:7d:82:3f:40

Hardware Port: Thunderbolt 2
Device: en2
Ethernet Address: 36:99:7d:82:3f:44

Hardware Port: Thunderbolt 3
Device: en3
Ethernet Address: 36:99:7d:82:3f:48

VLAN Configurations
===================
```

结果很明显，从`en0`到`en6`都是硬件，雷电接口，网桥，Wi-Fi...那么`en7`和`en8`这两个就是软件了。两个...我刚好有两条VPN配置，一个[Loon](https://apps.apple.com/us/app/loon/id1373567447)，一个[Stash](https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349)，会不会是系统升级导致VPN配置出了问题呢？

我尝试开关Loon[^loon]。这一开关不要紧，有不得了的发现了：Loon运行的时候，网络从不中断；但是只要Loon一关闭，网络就会在几秒或者几分钟内中断。

## 找到了？

删除了所有的VPN配置，清理路由表，然后重启电脑。

```
noblee.tung@MacBook-Pro ~ % sudo route -n flush
```

重启给了我一种假象，电脑刚刚开机的那段时间，网络非常稳定，一度让我认为问题已经解决了。当时已经很晚了，所以我开开心心上床睡大觉去了。

第二天早上一起来，天都塌了——网还是断的，根本就不是Loon的问题。

断网的绝望之中，我再次查看了一下路由表，没想到又有新的发现。路由表的第一行变成了：

```shell
noblee.tung@MacBook-Pro ~ % netstat -rn
Internet:
Destination        Gateway            Flags               Netif Expire
default            127.0.0.1          UGScg            feth4868 
...
```

`feth`，Fake Ethernet的缩写。看起来从现在开始，我们才逐渐开始逼近问题的真相。

`127.0.0.1`是一个著名的IP地址，也被称为**回环地址**或`localhost`。这个地址永远代表着本地设备，也就是我自己的这台电脑。一般我们用它测试服务的运行，就像是给自己寄出一封信，扔进邮筒，过几天邮递员就会送回来。如果没收到，则说明邮政服务出了问题，可能是没上班（服务未在运行），也可能是把信送错了地方。

这个路由表说明，本应通过`en0`，也就是Wi-Fi送往互联网的数据包，现在全都被送回到了我自己手上，而这条记录是一个叫做`feth4868`的神秘接口添加的。

我尝试关闭这个接口，无效，`feth4868`稳如泰山，所以应该是有一个或多个守护进程，只要我关闭它，就会立刻再次拉起它。

又一次重启Wi-Fi后，我开启了`route monitor`，持续监控路由表。

网络果然在几分钟内又断开了，但这一次我们做足了准备，`route monitor`告诉了我们一切。

```shell
noblee.tung@MacBook-Pro ~ % route monitor
...
got message of size 176 on Sun Dec 28 10:15:27 2025
RTM_ADD: Add Route: len 176, pid: 382, seq 1954, errno 0, flags:<UP,GATEWAY,DONE,STATIC>
locks:  inits: 
sockaddrs: <DST,GATEWAY,NETMASK,IFP,IFA>
 default localhost default index: 25  172.27.5.101
...
```

上午10点15分27秒，`PID 382`推入了一条默认路由，指向localhost，绑定了索引为25号的接口。

## `PID 382`是谁

使用Process Status，我们可以轻易检查某个进程的状态。那么就对`PID`为`382`的进程使用一下吧：


```shell
noblee.tung@MacBook-Pro ~ % ps -p 382 -o pid,ppid,user,command
PID  PPID USER COMMAND
382     1 root /usr/libexec/configd
```

看起来什么都说了，又好像什么都没说。

`configd`是macOS网络的总调度，它的其中一项职能就是管理路由。显然它不可能断开我的网络，所以一定是有某个网络扩展或者VPN之类的东西驱使它将这条记录装进了路由表。至于究竟是谁在驱使，很不幸，线索到这里中断了。没办法，只能回到上一步，使用`ifconfig`去研究`feth4868`这个接口。

```shell
noblee.tung@MacBook-Pro ~ % ifconfig feth4868
feth4868: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> metric 5000 mtu 2800
          options=8<VLAN_HWTAGGING>
          ether d6:8b:8e:3b:53:14
          inet 172.27.5.101 netmask 0xffff0000 broadcast 172.27.255.255
          peer: feth9868
          media: autoselect (10Gbase-T <full-duplex>)
          status: active
```

突然出现的`peer`让我眼前一亮：这个接口是成对出现的！

这是网桥的典型特征。目前看来，这应该是某种透明代理干的。在我的电脑里，能产生这样的接口对的软件太多了，虽然`feth4868`的线索断了，但我们只要知道另一边`feth9868`的有关信息，也可以解决这个问题。

## 真相大白

`lsof`是个很棒的工具，我们可以看到`feth9868`属于哪个进程。

```shell
noblee.tung@MacBook-Pro ~ % sudo lsof -nP | grep "feth"
COMMAND    PID   USER    FD   TYPE               DEVICE  SIZE/OFF      NODE NAME
MacEthern  647   root    3u   ndrv   0xa74f6360b3f2d7bc       0t0           -> feth9868
```

`PID 382`是收到指令的`configd`，那么这个`PID 647`则是发出指令的一方。

到了这里问题就已经解决了：我们只需要再使用一次Process Status就可以了。

```shell
noblee.tung@MacBook-Pro ~ % ps -p 647 -o pid,ppid,command
PID  PPID COMMAND
647   535 /Library/Application Support/ZeroTier/One/MacEthernetTapAgent 4868 d6:8b:8e:3b:53:14 2800 5000
```

这个路径是ZeroTier的！

也就是说在更新之后，ZeroTier出现了一些莫名其妙的故障，不断切断我的网络。接下来的就简单了，删除ZeroTier，尝试重新安装，如果还是出现这样的问题，就说明ZeroTier本身有故障，等下一个版本更新就好，或者切换Tailscale。

删除，重启，果然这个问题再也没出现过。

### 三个问题

#### 为什么在专教的时候网络没出问题？

这正说明是ZeroTier的问题。我在专教远程的方案就是打开ZeroTier，通过Windows App连接到寝室的台式机，在此期间，ZeroTier全程处于运行状态，很意外地没有推入路由表切断我的网络。

#### 为什么断开Wi-Fi重连会让网络短暂恢复？

这样刷新了路由表，让Wi-Fi的`en0`重新处于路由表的最上方，随后ZeroTier启动，再次插入回环地址。

#### 为什么打开Loon后网络不会断开？

Loon比ZeroTier优先级更高，它开启的时候的时候，ZeroTier无法写入回环地址，数据包可以正常通过Loon路由进互联网；而它关闭后，ZeroTier就可以写入了。Loon这种软件设计了Kill Switch也是正常的，所以最开始我会误以为是Loon没有正确清理写入的路由表。

## 写在最后

对于一个熟悉macOS的工程师或者经常进行网络调试的开发者来说，定位这种问题可能就是随手的事情。我作为一个非专业的外行，有一种自学了1+1就要解微积分的感觉。但是到了最后，我有一种很特别的爽，一种无与伦比的成就感。

我想说的是，对于这样的问题，我们只能一点点排查。从来没有那种通用的解决方式，如果有的话，那就是求知欲、冷静的思维和不放弃的精神。



[^xmcdx]:现在有[新版本](https://apps.apple.com/cn/app/熊猫吃短信2-垃圾短信拦截/id1642682818)

[^loon]:如果你问我用Loon做什么...唔，用来抓包，绝对没有拿来干别的哦（笑

