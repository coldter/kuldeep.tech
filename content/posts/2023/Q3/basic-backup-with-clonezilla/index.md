---
weight: 1
title: "Basic Backup With Clonezilla: Part-I(Backup)"
subtitle: ""
description: "Clonezilla is a great utility for backing up your system; in this post, we are going to get an overview of it by creating a backup image of our boot drive."
date: 2023-09-05T00:06:59+05:30
lastmod: 2023-09-05T00:07:01+05:30
draft: false

featuredImagePreview: "featured-image-preview.png"
featuredImage: "featured-image.webp"

tags: ["utility", "backup", "clonezilla"]
categories: ["tech"]
series: ["Disk image backup with clonezilla"]
series_weight: 1
license: '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
hiddenFromSearch: false
hiddenFromHomePage: false

lightgallery: true


table:
sort: false

toc:
  auto: false

comment:
  utterances:
    enable: true

math:
  enable: false
---

I like to try out new things and experiment with my systems quite a lot, and because of that, sometimes things break or don't quite work as expected. Sometimes it's a compatibility issue or because I messed up something. And that has sometimes cost me a lot of unnecessary effort and time.

I mostly never have to worry about most of my data, as I keep backups for most of it, or they are on cloud storage that I keep in sync with my local storage. It's the state of my system that sometimes throws me off-guard, like, for instance, when I won't be able to boot because my new arch update had an issue with my bootloader, or sometimes a software update breaks in some unexpected way and I have to figure out what's wrong and fix it. So I like to keep a backup of my system state so that I can restore it to a working state if something goes wrong, and I need it to work as soon as possible. And that backup is mostly a disk image of my system with minimal things installed and configured. For that, up until now I've used g-parted and `dd` for the most part, which are fairly basic and dumb utilities and work great. There are other, more advanced solutions out there, like Timeshift and Snapper, but they require a lot more setup and some insight into filesystems. For the most part, in my use  case, I just want my system back up and running if I happen to break it. For the most part, I don't require point-in-time backups or incremental backups.

One of the best and most reliable solutions is **clonezilla** which is a fairly straight-forward piece of software for imaging/cloning most kinds of disks. It also has some quite useful features that can be useful in certain situations. For now, we'll go over some of the basic features of clonezilla and how to utilize them for simple backup and restore.

## What is clonezilla?

[Clonezilla](https://clonezilla.org/) is a partition and disk imaging/cloning program. Clonezilla saves and restores only used blocks on the hard disk. This increases the clone's efficiency. It also has some additional features like enhanced support for all the major filesystems; therefore, you can clone GNU/Linux, MS windows, Intel-based Mac OS, FreeBSD, NetBSD, OpenBSD, Minix, VMWare ESX and Chrome OS/Chromium OS, no matter it's 32-bit (x86) or 64-bit (x86-64) OS, images can be stored on a local disk, ssh server, samba server, or NFS server. Supports image encryption, and with the Clonezilla server, it can be scaled to clone multiple systems at once. There are three types of Clonezilla available: Clonezilla Live, Clonezilla live, Clonezilla lite and server edition. We'll be using the live edition for our use-case.

### Limitations

- The destination partition must be equal to or larger than the source one.
{{< admonition type=info title="Info" open=false >}}
Though you can use utilities like [`gparted`](https://gparted.org/) another great utility, to resize the data partition to fit your needs,
{{< /admonition >}}
- Incremental backup is not implemented yet.
- Online imaging/cloning are not implemented yet. The partition to be imaged or cloned has to be unmounted.
- All the files have to be on one medium if you choose to create the recovery ISO file.

## Creating a backup

For this purpose, we'll be using the Clonezilla Live edition's local device/device to image feature.

### Download

Download the latest stable release of Clonezilla Live edition from their [download page](https://clonezilla.org/downloads.php), *in my experience, the official host, SourceForge, is very unreliable. You can download it from [here](https://github.com/coldter/clonezilla-mirror/releases) if I happen to have the latest stable version*. After downloading the ISO file, you have to burn it to bootable media to boot into it. You can use any tool of your choice to burn the ISO file to bootable media. I personally use [ventoy](https://www.ventoy.net/en/index.html) for this purpose, as it's very easy to use and supports most of the ISO files out of the box (more info about ventoy [here](/posts/ventoy-a-great-util-for-bootable-media/)).

### Booting into clonezilla

- Boot into the bootable media you created with clonezilla live edition. You should see a screen similar to the following. **select the `Clonezilla live (VGA with large font & TO RAM)` it's the option I had most success with, and in my opinion, it looks better with large fonts.**
![clonezilla boot screen](0_boot.png)

- On the next screen, select English as the language, and after that, select to keep the default keyboard layout (for the most part, it should auto-detect the correct one).
![clonezilla language selection](1_lang.png)
![clonezilla keyboard layout selection](2_keylayout.png)

- On the next screen, select `Start_Clonezilla` to start the clonezilla live edition.
![clonezilla start screen](3_start.png)

### Using device to image feature

- On the  next screen, select `device-image` this will create an image of the selected device and save it to another destination.
![device-image](4_device-image.png)

- On the next screen, select `local_dev` to create an image of the local device. This will create an image of the selected device and save it to another connected storage device.
![local_dev](5_local_dev.png)

- Now you will see a screen similar to the following, which suggests inserting any external storage device to save the image to. Insert the storage device and wait for it to be detected by clonezilla. After that, select `Enter` to continue.
![insert external storage device](6_insert_ext_dev.png)

- On the next screen, you should have a list of all the detected storage devices. If all your storage devices are detected correctly, then you'll have to press `ctrl + c` to continue (at first, this part confused me as it requires you to press `ctrl + c` to continue).
![detected storage devices](7_detected_dev.png)

- On the next screen, you'll have to select the device you want the backup to be stored on (***the destination/USB***). Make sure you select the correct device, as this will overwrite the existing data on the selected device. After that, select `Enter` to continue.
![select device to image](8_select_dev.png)

- On the next screen, you can select `no-fsck` to skip an additional file system check before creating the image to speed up the process. After that, select `Enter` to continue.
![skip fsck](9_skip_fsck.png)

- Onto the next screen, make sure the `Current selected dir nam:` shows `/` use `tab` key to select `<Done>` and press `Enter` to continue.
![select entire disk](10_select_entire_disk.png)

- Press `Enter` to continue.
  
- On the next screen, you can select `Beginner` to use the default options for creating the image. After that, select `Enter` to continue.
![select beginner](11_select_beginner.png)

- On the next screen, you can select `savedisk` to create an image of the entire disk. After that, select `Enter` to continue.
![select save-disk](12_select_savedisk.png)

- Next, you'll be prompted to enter the name of the image file. You can use the default name or enter a custom name. After that, use `tab` and `Enter` to continue.
![enter image name](13_enter_img_name.png)

- On the next screen, you'll have to select the device you want to create the image of (***the source***). Pay attention to the device name and size to make sure you're selecting the correct device. After selecting the device, press `Enter` to continue.
![select backup storage device](14_select_backup_dev.png)

- On the next screen, you can select the default compression level. After that, select `Enter` to continue.
![select compression level](15_select_compression_level.png)

- Next up, you can also skip the extra parameters check; press `tab` and `Enter` to continue.
![skip extra parameters check](16_skip_extra_params_check.png)

- On the next screen, you'll be asked if you want to check the image for restorability. You can skip or select the default option. After that, select `Enter` to continue.
![check image for restorability](17_check_img_for_restorability.png)

- Next, select no encryption, or if you want to encrypt the image, select the option with the preferred encryption method. After that, select `Enter` to continue.
![select encryption](18_select_encryption.png)

- After you'll be prompted to choose an action after finishing the creation of the image, you can select the default option and use `tab` and `Enter` to continue.
![select action after finishing the creation of image](19_select_action_after_finish.png)

- On prompt, press "Enter" to continue.

- Press "y" to confirm and start the process.
![confirm and start](20_confirm_and_start.png)

- If everything is done correctly, the clone process should start, and you should see a screen similar to the following:
![clone process](21_clone_process.png)

- When everything is done, Clonezilla will prompt you if you want to run it again (when something goes wrong, or you want to choose different options)

- Then you can choose to power off or reboot to exit clonezilla. After that, select `Enter` to continue.
![Power off or reboot.](22_poweroff_or_reboot.png)

- After that, you can remove the bootable media and reboot your system.

## Conclusion

{{< admonition type=danger title="🚧" open=true >}}
Clonezilla is a community-driven project, and something might change in the future. Please read every instruction from clonezilla carefully before proceeding. This is just a guide to get you started.

Data loss may occur in the process; make sure you have a good idea of what you're doing and have a backup of your data before proceeding.
{{< /admonition >}}

Though it's not the most intuitive piece of software or the most user-friendly one, it's quite powerful and reliable. But it has served me quite well, and I hope it'll be useful for you too. And maybe in the following part we'll go over how to restore the image we created in this part.

{{< figure src="end.gif" title="The End" >}}
