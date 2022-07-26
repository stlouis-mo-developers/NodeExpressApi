SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ITCC_WebsiteUser](
	[ITCC_WebsiteUserID] [int] IDENTITY(1,1) NOT NULL,
	[ITCC_WebsiteID] [int] NOT NULL,
	[ITCC_UserID] [int] NOT NULL,
	[IPAddress] [nvarchar](384) NULL,
	[CreateDate] [datetime] NULL,
	[CreateUserID] [int] NULL,
	[ModifyDate] [datetime] NULL,
	[ModifyUserID] [int] NULL,
 CONSTRAINT [PK_ITCC_WebsiteUser] PRIMARY KEY CLUSTERED 
(
	[ITCC_WebsiteUserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_ITCC_WebsiteUser] UNIQUE NONCLUSTERED 
(
	[ITCC_WebsiteID] ASC,
	[ITCC_UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

